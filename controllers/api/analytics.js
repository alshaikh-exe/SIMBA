import Semester from "../../models/semester.js";
import Order from "../../models/order.js";

/**
 * GET /api/analytics/usage
 * Returns usage counts grouped by semester
 */
export async function usageBySemester(req, res) {
  try {
    // load semesters sorted chronologically
    const semesters = await Semester.find().sort({ startDate: 1 });

    const results = [];

    for (const sem of semesters) {
      // fetch orders that fall into this semester
      const orders = await Order.find({
        createdAt: { $gte: sem.startDate, $lte: sem.endDate },
      }).lean();

      // sum total items checked out
      let totalQty = 0;
      orders.forEach(order => {
        order.lineItems.forEach(li => {
          totalQty += li.qty;
        });
      });

      results.push({
        semester: sem.name,
        startDate: sem.startDate,
        endDate: sem.endDate,
        totalOrders: orders.length,
        totalItems: totalQty,
      });
    }

    res.json({ success: true, data: results });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ success: false, message: "Analytics failed" });
  }
}