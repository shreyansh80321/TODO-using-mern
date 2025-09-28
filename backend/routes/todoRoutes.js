import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import Todo from '../models/Todo.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  const todo = await Todo.find().sort({ createdAt: -1 });
  res.json(todo)
}));

router.post('/',asyncHandler(async (req, res) => {
  const todo = new Todo({ text: req.body.text });
  await todo.save();
  res.status(201).json(todo);
}))

router.put('/:id', asyncHandler(async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body,{
    new: true,
  });
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.json(todo);
}))

router.delete('/:id', asyncHandler(async(req, res)=>{
  const todo = await Todo.findByIdAndDelete(req.params.id)
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.json({message:"Todo deleted"})
}))

export default router;