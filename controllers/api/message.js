import Message from "../../models/message";

export {
    createMessage,
    getMessageByOrder,
    getUserMessages,
    deleteMessage
}

//creating message
async function createMessage(req, res) {
  try {
    const message = await Message.create({
      user: req.user._id,
      order: req.body.orderId,
      type: req.body.type,
      message: req.body.message
    })
         res.status(201).json(message)
      } catch (e) {
    res.status(400).json({ msg: e.message })
      }
    }

//get message from specific order
async function getMessageByOrder(req, res) {
    try{
        const messages = await Message.find({ order: req.params.orderId })
        .populate('user', 'name email')
        .sort('createdAt')
        res.status(200).json(messages)
    }  catch (e) {
    res.status(400).json({ msg: e.message })
  }  
}

//get message from user
async function getUserMessages(req, res) {
  try {
    const messages = await Message.find({ user: req.user._id })
      .populate('order')
      .sort('-createdAt')
    res.status(200).json(messages)
  } catch (e) {
    res.status(400).json({ msg: e.message })
  }
}

//Deleting message 
async function deleteMessage(req, res) {
    try{
      const deleted = await Message.findOneAndDelete({
      _id: req.params.id,
      })
      if (!deleted) throw new Error('Message not found or not authorized');
      res.status(200).json({ msg: 'Message deleted successfully' });
  } catch (e) {
      res.status(400).json({ msg: e.message });
  }

}
