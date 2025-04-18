/* Copyright 2025 Prokhor Kalinin

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, NextFunction } from 'express';

import { report } from '../../winston.config';
import { morse } from '../util/morse';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    public use(req: Request, _res: Response, next: NextFunction): void {
        report.info(morse.cyan('Request ') + morse.magenta(req.method) + morse.cyan(' to: ') + morse.magenta(req.originalUrl));
        next();
    }
}