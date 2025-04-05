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

import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import AppModule from './app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Just Enable CORSm it's a public API.
    app.enableCors();

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true
    }));

    app.useStaticAssets(join(__dirname, '..', 'public'), {
        prefix: '/public/'
    });

    if (process.env.EXPOSE_SWAGGER) {
        const config = new DocumentBuilder()
            .setTitle('Mabel Assistant API')
            .setDescription('Mabel Assistant Docs')
            .setVersion('0.0.1')
            .addBearerAuth()
            .build();

        console.log('Setting Up Swagger');
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('docs', app, document);
    }

    await app.listen(3000);
}

bootstrap();