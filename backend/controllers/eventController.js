const { query } = require('../config/db');
const { sendMail } = require('../config/mailer');
const path = require('fs');

// Get Events & Conferences (Public)
const getEvents = async (req, res) => {
  const type = req.query.type; // event, conference
  const timeFilter = req.query.timeFilter; // upcoming, past
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    let queryStr = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (type) {
      queryStr += ' AND type = ?';
      params.push(type);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    if (timeFilter === 'upcoming') {
      queryStr += ' AND date >= ?';
      params.push(todayStr);
      queryStr += ' ORDER BY date ASC';
    } else if (timeFilter === 'past') {
      queryStr += ' AND date < ?';
      params.push(todayStr);
      queryStr += ' ORDER BY date DESC';
    } else {
      queryStr += ' ORDER BY date DESC';
    }

    // Get count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM (${queryStr}) as cnt`;
    const countRes = await query(countQuery, params);
    const total = countRes[0].total;

    // Apply pagination
    queryStr += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const data = await query(queryStr, params);

    res.json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('getEvents error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Event by ID
const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const events = await query('SELECT * FROM events WHERE id = ?', [id]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(events[0]);
  } catch (error) {
    console.error('getEventById error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Register for an Event (Public)
const registerForEvent = async (req, res) => {
  const { event_id, name, email, phone, organization } = req.body;

  if (!event_id || !name || !email || !phone) {
    return res.status(400).json({ message: 'Required fields: event_id, name, email, phone' });
  }

  try {
    const events = await query('SELECT title, date, location FROM events WHERE id = ?', [event_id]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const event = events[0];

    // Check duplicate registration
    const duplicates = await query(
      'SELECT id FROM event_registrations WHERE event_id = ? AND email = ?',
      [event_id, email]
    );
    if (duplicates.length > 0) {
      return res.status(400).json({ message: 'You have already registered for this event.' });
    }

    await query(
      `INSERT INTO event_registrations (event_id, name, email, phone, organization)
       VALUES (?, ?, ?, ?, ?)`,
      [event_id, name, email, phone, organization || null]
    );

    // Send confirmation email
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    await sendMail({
      to: email,
      subject: `Registration Confirmed: ${event.title}`,
      text: `Dear ${name},\n\nYour registration for the event "${event.title}" has been confirmed!\n\nDate: ${formattedDate}\nLocation: ${event.location}\n\nWe look forward to seeing you there.\n\nBest regards,\nUdupi Management Association`,
      html: `<p>Dear <strong>${name}</strong>,</p>
             <p>Your registration for the event "<strong>${event.title}</strong>" has been confirmed!</p>
             <ul>
               <li><strong>Date:</strong> ${formattedDate}</li>
               <li><strong>Location:</strong> ${event.location}</li>
             </ul>
             <p>We look forward to seeing you there.</p>
             <p>Best regards,<br/><strong>Udupi Management Association</strong></p>`
    });

    res.status(201).json({ message: 'Successfully registered for the event.' });
  } catch (error) {
    console.error('registerForEvent error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin Operations

// Create Event
const createEvent = async (req, res) => {
  const { title, description, content, date, time, location, type } = req.body;
  let image_url = null;

  if (!title || !description || !date || !time || !location) {
    return res.status(400).json({ message: 'Required fields: title, description, date, time, location' });
  }

  if (req.file) {
    image_url = `/uploads/events/${req.file.filename}`;
  }

  try {
    const result = await query(
      `INSERT INTO events (title, description, content, date, time, location, image_url, type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, content || null, date, time, location, image_url, type || 'event']
    );

    res.status(201).json({
      message: 'Event created successfully',
      eventId: result.insertId
    });
  } catch (error) {
    console.error('createEvent error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, content, date, time, location, type } = req.body;

  try {
    const events = await query('SELECT image_url FROM events WHERE id = ?', [id]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    let image_url = events[0].image_url;
    if (req.file) {
      image_url = `/uploads/events/${req.file.filename}`;
    }

    await query(
      `UPDATE events 
       SET title = ?, description = ?, content = ?, date = ?, time = ?, location = ?, image_url = ?, type = ?
       WHERE id = ?`,
      [title, description, content || null, date, time, location, image_url, type || 'event', id]
    );

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('updateEvent error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM events WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('deleteEvent error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all registrations for a specific event or all registrations (Admin)
const getEventRegistrations = async (req, res) => {
  const eventId = req.query.eventId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  try {
    let queryStr = `
      SELECT er.*, e.title as event_title, e.date as event_date 
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (eventId) {
      queryStr += ' AND er.event_id = ?';
      params.push(eventId);
    }

    // Get count
    const countQuery = `SELECT COUNT(*) as total FROM (${queryStr}) as cnt`;
    const countRes = await query(countQuery, params);
    const total = countRes[0].total;

    queryStr += ' ORDER BY er.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const data = await query(queryStr, params);

    res.json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('getEventRegistrations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete an event registration (Admin)
const deleteEventRegistration = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM event_registrations WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('deleteEventRegistration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getEvents,
  getEventById,
  registerForEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  deleteEventRegistration
};
