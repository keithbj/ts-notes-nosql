import Router from 'express';
import { createNote, getNotes, getNote, updateNote, deleteNote } from '../controllers/notes';

const router = Router();

router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
