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

import { Column, Entity } from 'typeorm';

import { GeneralEntity } from '../../common/entities/general.entity';

/**
 * Represents a stopwatch entity.
 * This class is used to define the attributes and behavior of a stopwatch.
 * @extends GeneralEntity
 *
 * Entity Name: 'stopwatch'
 */
@Entity({ name: 'stopwatch' })
export class Stopwatch extends GeneralEntity {
    /**
     * Represents a name of a stopwatch
     * @type {string}
     */
    @Column()
    public name: string;

    /**
     * A boolean variable indicating the running state of an stopwatch.
     * - `true`: The stopwatch is currently running.
     * - `false`: The stopwatch is not running.
     * @type {boolean}
     */
    @Column({ name: 'is_running', default: false })
    public isRunning: boolean;

    /**
     * Represents the amount of time that has passed or elapsed.
     * This value is the "saved" elapsed time, it does not store elapsed time if the stopwatch is running.
     * That value should be calculated based on elapsed time and start time of the stopwatch.
     * elapsed time should only be updated when the stopwatch is stopped.
     * @type {number}
     */
    @Column({ default: 0 })
    public elapsed: number;

    /**
     * Represents the starting time of the stopwatch
     * It can either hold a Date object indicating the start time
     * or be null if the start time is not set or applicable.
     *
     * @type {Date | null}
     */
    @Column({ name: 'start_time', type: 'timestamp', nullable: true })
    public startTime: Date | null;
}