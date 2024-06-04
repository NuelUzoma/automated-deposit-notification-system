import { Router } from 'express';
import {
    httpCreateWallet,
    httpWalletDeposit
} from '../controllers/wallet.controller.js';
import { httpTriggerDeposit } from '../controllers/autoDeposit.controller.js';

const walletRouter = Router();


walletRouter.post('/create', httpCreateWallet);

walletRouter.put('/deposit/:walletId', httpWalletDeposit);

walletRouter.post('/trigger-deposit', httpTriggerDeposit);


export default walletRouter;