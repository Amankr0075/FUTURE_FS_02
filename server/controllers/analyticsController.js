const Lead = require('../models/Lead');

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const contactedLeads = await Lead.countDocuments({ status: 'Contacted' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });
    const proposalLeads = await Lead.countDocuments({ status: 'Proposal Sent' });
    const convertedLeads = await Lead.countDocuments({ status: 'Converted' });
    const lostLeads = await Lead.countDocuments({ status: 'Lost' });

    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

    // Leads by source
    const leadsBySource = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $project: { source: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    // Monthly lead growth (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyGrowth = await Lead.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              { $cond: [{ $lt: ['$_id.month', 10] }, { $concat: ['0', { $toString: '$_id.month' }] }, { $toString: '$_id.month' }] },
            ],
          },
          count: 1,
        },
      },
    ]);

    // Status distribution
    const statusDistribution = [
      { status: 'New', count: newLeads },
      { status: 'Contacted', count: contactedLeads },
      { status: 'Qualified', count: qualifiedLeads },
      { status: 'Proposal Sent', count: proposalLeads },
      { status: 'Converted', count: convertedLeads },
      { status: 'Lost', count: lostLeads },
    ].filter((s) => s.count > 0);

    // Most effective lead source (highest conversion)
    const sourceConversionData = await Lead.aggregate([
      {
        $group: {
          _id: '$source',
          total: { $sum: 1 },
          converted: { $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] } },
        },
      },
      {
        $project: {
          source: '$_id',
          total: 1,
          converted: 1,
          conversionRate: {
            $cond: [
              { $gt: ['$total', 0] },
              { $multiply: [{ $divide: ['$converted', '$total'] }, 100] },
              0,
            ],
          },
        },
      },
      { $sort: { conversionRate: -1 } },
    ]);

    // Recent leads (last 5)
    const recentLeads = await Lead.find().sort('-createdAt').limit(5).select('name email status source createdAt');

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalLeads,
          newLeads,
          contactedLeads,
          qualifiedLeads,
          proposalLeads,
          convertedLeads,
          lostLeads,
          conversionRate: parseFloat(conversionRate),
        },
        leadsBySource,
        monthlyGrowth,
        statusDistribution,
        sourceConversionData,
        recentLeads,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAnalytics };
