import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { PasswordManager } from '../services/password-manager';
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@akyshtickets/common';

const router = express.Router();

router.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError('Incorrect user or password');
        }

        const passwordsMatch = await PasswordManager.compare(existingUser.password, password);
        if (!passwordsMatch) {
            throw new BadRequestError('Incorrect user or password');
        }

        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        },
            process.env.JWT_KEY!
        );

        req.session = {
            jwt: userJwt
        };

        res.status(200).send(existingUser);
    });

export { router as signinRouter };