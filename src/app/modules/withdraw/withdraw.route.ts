import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { withdrawController } from './withdraw.controller';


const withdrawRouter = express.Router();

withdrawRouter
  .post('/add-withdraw', auth(USER_ROLE.MENTOR), withdrawController.addWithdraw)
  .get('/', auth(USER_ROLE.ADMIN), withdrawController.getAllWithdraw)
  .get(
    '/mentor',
    auth(USER_ROLE.MENTOR),
    withdrawController.getAllWithdrawByMentor,
  )
  .get('/:id', withdrawController.getSingleWithdraw)
  .patch(
    '/status/:id',
    auth(USER_ROLE.ADMIN),
    withdrawController.getAllWithdrawRequestAccept,
  )
  .delete('/:id', withdrawController.deleteSingleWithdraw);

export default withdrawRouter;
