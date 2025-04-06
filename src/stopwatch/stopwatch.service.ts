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

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { report } from '../winston.config';
import { morse } from '../common/util/morse';

import { Stopwatch } from './entities/stopwatch.entity';
import { StopwatchDto } from './dtos/stopwatch.dto';
import { UpdateStopwatchDto } from './dtos/update-stopwatch.dto';
import { CreateStopwatchDto } from './dtos/create-stopwatch.dto';

/**
 * A service providing stopwatch-related functionality, such as creating, updating,
 * starting, stopping, and deleting stopwatch entities. Responsible for managing
 * stopwatch data persistently through the underlying repository and transforming
 * entities to DTOs for external operations.
 */
@Injectable()
export class StopwatchService {
    /**
     * Constructs an instance of the class.
     *
     * @param {Repository<Stopwatch>} stopwatchRepository - The repository instance for the Stopwatch entity, injected as a dependency.
     * @return {void} Does not return any value.
     */
    public constructor(
        @InjectRepository(Stopwatch) private readonly stopwatchRepository: Repository<Stopwatch>
    ) {
    }

    /**
     * Retrieves all stopwatches from the repository, converts them to DTOs and returns the result.
     *
     * @return {Promise<StopwatchDto[]>} A promise that resolves to an array of Stopwatch Data Transfer Objects (DTOs).
     */
    public async findAll(): Promise<StopwatchDto[]> {
        const stopwatches = await this.stopwatchRepository.find({ order: { id: 'ASC' } });
        report.debug(morse.grey('Found ') + morse.magenta(`${stopwatches.length}`) + morse.grey(' stopwatches'));
        return stopwatches.map((stopwatch) => this.toDto(stopwatch) );
    }

    /**
     * Creates a new stopwatch record in the repository.
     *
     * @param {CreateStopwatchDto} createStopwatchDto - The data transfer object containing information needed to create a new stopwatch.
     * @return {Promise<StopwatchDto>} A promise that resolves to the data transfer object representing the created stopwatch.
     */
    public async create(createStopwatchDto: CreateStopwatchDto): Promise<StopwatchDto> {
        return this.toDto(await this.stopwatchRepository.save(createStopwatchDto));
    }

    /**
     * Starts a stopwatch with the given ID, updating its state to running.
     *
     * This method retrieves a stopwatch by its ID from the repository, verifies its existence,
     * and ensures it is not already running before starting it. The elapsed time since the last
     * start is calculated, and the new state is persisted in the database.
     *
     * @param {number} id - The unique identifier of the stopwatch to start.
     * @return {Promise<StopwatchDto>} A promise that resolves to the updated stopwatch data transfer object (DTO).
     * @throws {NotFoundException} If the stopwatch with the specified ID does not exist.
     * @throws {BadRequestException} If the stopwatch is already running.
     */
    public async start(id: number): Promise<StopwatchDto> {
        const stopwatch = await this.stopwatchRepository.findOne({ where: { id } });
        if (!stopwatch) throw new NotFoundException(`Stopwatch #${id} not found`);
        if (stopwatch.isRunning) throw new BadRequestException(`Stopwatch #${id} is already running`);

        report.debug(morse.grey('Starting stopwatch  ') + morse.magenta(`#${stopwatch.id}`));
        stopwatch.isRunning = true;
        stopwatch.startTime = new Date();
        return this.toDto(await this.stopwatchRepository.save(stopwatch));
    }

    /**
     * Stops the stopwatch with the given ID if it is currently running.
     *
     * @param {number} id - The ID of the stopwatch to stop.
     * @return {Promise<StopwatchDto>} A promise that resolves with the updated stopwatch data as a DTO.
     * @throws {NotFoundException} If a stopwatch with the given ID is not found.
     * @throws {BadRequestException} If the stopwatch with the given ID is not currently running.
     */
    public async stop(id: number): Promise<StopwatchDto> {
        const stopwatch = await this.stopwatchRepository.findOne({ where: { id } });
        if (!stopwatch) throw new NotFoundException(`Stopwatch #${id} not found`);
        if (!stopwatch.isRunning) throw new BadRequestException(`Stopwatch #${id} is not running`);

        report.debug(morse.grey('Stopping stopwatch  ') + morse.magenta(`#${stopwatch.id}`));

        stopwatch.elapsed = this.calculateElapsed(stopwatch);
        stopwatch.isRunning = false;
        stopwatch.startTime = null;
        return this.toDto(await this.stopwatchRepository.save(stopwatch));
    }

    /**
     * Updates an existing stopwatch with the provided data.
     *
     * @param {number} id - The unique identifier of the stopwatch to be updated.
     * @param {UpdateStopwatchDto} updateDto - The data transfer object containing updated attributes for the stopwatch.
     * @return {Promise<StopwatchDto>} A promise that resolves to the updated stopwatch data transfer object.
     * @throws {NotFoundException} Throws an exception if the stopwatch with the specified ID is not found.
     */
    public async update(id: number, updateDto: UpdateStopwatchDto): Promise<StopwatchDto> {
        const stopwatch = await this.stopwatchRepository.findOne({ where: { id } });
        if (!stopwatch) throw new NotFoundException(`Stopwatch #${id} not found`);
        if (updateDto.elapsed && stopwatch.isRunning) throw new BadRequestException('Cannot update elapsed time while stopwatch is running');

        report.debug(morse.grey('Updating stopwatch  ') + morse.magenta(`#${stopwatch.id}`));

        const patchedStopwatch = { ...stopwatch, ...updateDto };
        return this.toDto(await this.stopwatchRepository.save(patchedStopwatch));
    }

    /**
     * Deletes a stopwatch entry with the specified ID by marking it as deleted in the repository.
     *
     * @param {number} id - The unique identifier of the stopwatch entry to be deleted.
     * @return {Promise<string>} A promise that resolves to a string confirming the deletion operation, typically 'ok'.
     */
    public async delete(id: number): Promise<string> {
        const stopwatch = await this.stopwatchRepository.findOne({ where: { id } });
        if (!stopwatch) throw new NotFoundException(`Stopwatch #${id} not found`);
        if (stopwatch.isRunning) throw new BadRequestException(`Cannot delete stopwatch #${id} while it is running`);

        report.debug(morse.grey('Deleting stopwatch  ') + morse.magenta(`#${stopwatch.id}`));

        await this.stopwatchRepository.softDelete({ id });
        return 'ok';
    }

    /**
     * Converts a Stopwatch object to a StopwatchDto object.
     *
     * @param stopwatch The Stopwatch instance to be converted.
     * @return A StopwatchDto object containing the id, name, elapsed time, and running status of the given Stopwatch.
     */
    private toDto(stopwatch: Stopwatch): StopwatchDto {
        return {
            id: stopwatch.id,
            name: stopwatch.name,
            elapsed: this.calculateElapsed(stopwatch),
            isRunning: stopwatch.isRunning
        };
    }

    /**
     * Calculates the elapsed time for a given Stopwatch instance.
     * If the stopwatch is not running, it returns the current elapsed time.
     * If the stopwatch is running, it calculates the elapsed time by considering the time since it was started.
     *
     * @param {Stopwatch} stopwatch - The stopwatch instance containing elapsed time and start information.
     * @return {number} The total elapsed time in seconds.
     */
    private calculateElapsed(stopwatch: Stopwatch): number {
        if (!stopwatch.isRunning) {
            return stopwatch.elapsed;
        } else {
            const currentTime = new Date();
            const startTime = stopwatch.startTime ? new Date(stopwatch.startTime) : currentTime;
            const timeDifference = (currentTime.getTime() - startTime.getTime()) / 1000; // Difference in seconds
            return Math.floor(stopwatch.elapsed + timeDifference);
        }
    }
}
