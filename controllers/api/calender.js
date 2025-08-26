import Order from "../../models/order.js";

export async function getUserCalendar(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("lineItems.item");

    const events = orders.flatMap(order => [
      { title: `Pickup Order #${order.orderId}`, date: order.pickupDate, type: "pickup" },
      ...order.lineItems.map(lineItem => ({
        title: `Return Deadline: ${lineItem.item.name}`,
        date: lineItem.returnDeadline,
        type: "return"
      }))
    ]);

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAdminCalendar(req, res) {
  try {
    const orders = await Order.find().populate("lineItems.item").populate("user", "name");

    const events = orders.flatMap(order => [
      { title: `Pickup: ${order.user.name}`, date: order.pickupDate, type: "pickup" },
      ...order.lineItems.map(lineItem => ({
        title: `Return Deadline (${order.user.name}): ${lineItem.item.name}`,
        date: lineItem.returnDeadline,
        type: "return"
      }))
    ]);

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function setOrderDates(req, res) {
  try {
    const { pickupDate, returnDates } = req.body;

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.pickupDate = new Date(pickupDate);

    returnDates.forEach(rd => {
      const lineItem = order.lineItems.id(rd.lineItemId);
      if (lineItem) lineItem.returnDeadline = new Date(rd.returnDeadline);
    });

    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
