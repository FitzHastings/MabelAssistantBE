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

/**
 * Data transfer object representing a stopwatch.
 * This class is used to encapsulate stopwatch-related information.
 */
export class StopwatchDto {
    /**
     * A unique identifier represented as a number.
     * This variable is used to distinguish entities or objects in a system.
     */
    @ApiProperty({ type: Number, description: 'Id of the stopwatch', example: 1 })
    public id: number;

    /**
     * Represents a name of the stopwatch
     */
    @ApiProperty({ type: String, description: 'Name of the stopwatch', example: 'My stopwatch' })
    public name: string;

    /**
     * A flag that represents whether the stopwatch is currently running or not
     */
    @ApiProperty({ type: Boolean, description: 'Is the stopwatch running', example: true })
    public isRunning: boolean;

    /**
     * Time Elapsed from starting a stopwatch.
     * This value  is ephemeral and is calculated for stopwatches that are running.
     */
    @ApiProperty({ type: Number, description: 'Elapsed time in seconds', example: 1000 })
    public elapsed: number;
}