const { query } = require('../config/db');

// Get Admin Dashboard Overview Statistics (Admin Only)
const getDashboardStats = async (req, res) => {
  try {
    // 1. Fetch counts
    const membersCount = await query('SELECT COUNT(*) as total FROM memberships');
    const eventsCount = await query('SELECT COUNT(*) as total FROM events');
    const registrationsCount = await query('SELECT COUNT(*) as total FROM event_registrations');
    const galleryCount = await query('SELECT COUNT(*) as total FROM gallery');
    const newsCount = await query('SELECT COUNT(*) as total FROM news');
    const contactsCount = await query('SELECT COUNT(*) as total FROM contacts');
    const nominationsCount = await query('SELECT COUNT(*) as total FROM award_nominations');

    // 2. Fetch monthly registration data for chart
    const monthlyRegistrations = await query(`
      SELECT DATE_FORMAT(created_at, '%b %Y') as month, COUNT(*) as count 
      FROM memberships 
      GROUP BY YEAR(created_at), MONTH(created_at) 
      ORDER BY MIN(created_at) ASC 
      LIMIT 12
    `);

    // 3. Fetch event participation data (top 6 events with highest registrations)
    const eventParticipation = await query(`
      SELECT e.title, COUNT(er.id) as registrations 
      FROM events e 
      LEFT JOIN event_registrations er ON e.id = er.event_id 
      GROUP BY e.id 
      ORDER BY registrations DESC 
      LIMIT 6
    `);

    res.json({
      stats: {
        totalMembers: membersCount[0].total,
        totalEvents: eventsCount[0].total,
        totalRegistrations: registrationsCount[0].total,
        totalNominations: nominationsCount[0].total,
        totalGallery: galleryCount[0].total,
        totalNews: newsCount[0].total,
        totalMessages: contactsCount[0].total
      },
      charts: {
        monthlyRegistrations,
        eventParticipation
      }
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getDashboardStats
};
