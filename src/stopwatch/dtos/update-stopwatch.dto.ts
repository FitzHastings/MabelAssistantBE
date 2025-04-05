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

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object for updating stopwatch details.
 *
 * This class is used to encapsulate the data required to update the properties of a stopwatch,
 * such as its name and elapsed time. Both fields are optional.
 */
export class UpdateStopwatchDto {
    /**
     * Name of the stopwatch
     */
    @ApiPropertyOptional({ type: String, description: 'Name of the stopwatch', example: 'My stopwatch' })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    public name: string;

    /**
     * Represents the amount of time that has passed measured in seconds.
     */
    @ApiPropertyOptional({ type: Number, description: 'Elapsed time in seconds (Overrides Server Stored Value)', example: 1000 })
    @IsInt()
    @IsOptional()
    public elapsed: number;
}