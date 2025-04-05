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

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a stopwatch.
 * This class is used to transfer and validate data required
 */
export class CreateStopwatchDto {
    /**
     * Represents a name as a string. This variable is typically used to store
     * a person's name, an identifier, or any textual data representing a name.
     */
    @ApiProperty({ type: String, description: 'Name of the stopwatch', example: 'My stopwatch' })
    @IsString()
    @IsNotEmpty()
    public name: string;
}