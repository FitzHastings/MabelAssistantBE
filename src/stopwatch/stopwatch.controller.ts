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

import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller, Delete,
    Get, Param, Patch,
    Post,
    UseInterceptors
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { StopwatchDto } from './dtos/stopwatch.dto';
import { StopwatchService } from './stopwatch.service';
import { CreateStopwatchDto } from './dtos/create-stopwatch.dto';
import { UpdateStopwatchDto } from './dtos/update-stopwatch.dto';

/**
 * Controller for the Stopwatch module that provides endpoints for managing stopwatches.
 * Handles operations such as retrieving all stopwatches, creating a new stopwatch,
 * starting or stopping an existing stopwatch, updating stopwatch details, and deleting a stopwatch.
 */
@ApiTags('Stopwatch Module')
@Controller('stopwatch')
export class StopwatchController {
    /**
     * Constructs a new instance of the class.
     *
     * @param {StopwatchService} stopwatchService - The service used to manage stopwatch functionality.
     */
    public constructor(
        private readonly stopwatchService: StopwatchService
    ) {
    }

    /**
     * Retrieves all stopwatches in the system.
     *
     * @return {Promise<StopwatchDto[]>} A promise that resolves with an array of StopwatchDto objects.
     */
    @ApiOperation({ summary: 'Get all stopwatches (Public)' })
    @ApiOkResponse({ type: StopwatchDto, description: 'All stopwatches in the system', isArray: true })
    @Get('/')
    public async findAll(): Promise<StopwatchDto[]> {
        return await this.stopwatchService.findAll();
    }

    /**
     * Creates a new stopwatch using the provided details.
     *
     * @param {CreateStopwatchDto} createStopwatchDto - The data required to create a new stopwatch.
     * @return {Promise<StopwatchDto>} A promise that resolves to the newly created stopwatch.
     */
    @ApiOperation({ summary: 'Create a new stopwatch (Public)' })
    @ApiOkResponse({ type: StopwatchDto, description: 'Created stopwatch (Public)' })
    @ApiBody({ type: () => CreateStopwatchDto })
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('/')
    public async create(@Body() createStopwatchDto: CreateStopwatchDto): Promise<StopwatchDto> {
        return await this.stopwatchService.create(createStopwatchDto);
    }

    /**
     * Starts a stopwatch by its id. This method retrieves the stopwatch associated with the provided id
     * and initiates its timing operation.
     *
     * @param {string} id - The id of the stopwatch to start. Must be a valid number string.
     * @returns {Promise<StopwatchDto>} A promise that resolves to the data transfer object of the started stopwatch.
     * @throws {BadRequestException} If the provided id is not a valid number.
     */
    @ApiOperation({ summary: 'Start a stopwatch by id (Public)' })
    @ApiParam({ name: 'id', type: Number, description: 'Id of the stopwatch to start', example: 1 })
    @ApiOkResponse({ type: StopwatchDto, description: 'Started stopwatch' })
    @Post('/start/:id')
    public async start(@Param('id') id: string): Promise<StopwatchDto> {
        const trueId = parseInt(id);
        if (!trueId) throw new BadRequestException(`Stopwatch #${id} is not a number`);
        return await this.stopwatchService.start(trueId);
    }

    /**
     * Stops a stopwatch based on the provided ID.
     *
     * @param {string} id - The ID of the stopwatch to stop, provided as a string.
     * @return {Promise<StopwatchDto>} A promise that resolves to the details of the stopped stopwatch.
     * @throws {BadRequestException} If the provided ID is not a valid number.
     */
    @ApiOperation({ summary: 'Stop a stopwatch by id (Public)' })
    @ApiParam({ name: 'id', type: Number, description: 'Id of the stopwatch to stop', example: 1 })
    @ApiOkResponse({ type: StopwatchDto, description: 'Stopped stopwatch' })
    @Post('/stop/:id')
    public async stop(@Param('id') id: string): Promise<StopwatchDto> {
        const trueId = parseInt(id);
        if (!trueId) throw new BadRequestException(`Stopwatch #${id} is not a number`);
        return await this.stopwatchService.stop(trueId);
    }

    /**
     * Updates an existing stopwatch by its ID.
     * Validates the provided ID and updates the stopwatch with the new details.
     *
     * @param {string} id - The ID of the stopwatch to update.
     * @param {UpdateStopwatchDto} updateDto - The data required to update the stopwatch.
     * @return {Promise<StopwatchDto>} Returns the updated stopwatch object.
     * @throws {BadRequestException} If the provided ID is not a valid number.
     */
    @ApiOperation({ summary: 'Update an existing stopwatch by id (Public)' })
    @ApiParam({ name: 'id', type: Number, description: 'Id of the stopwatch to update', example: 1 })
    @ApiOkResponse({ type: StopwatchDto, description: 'Updated stopwatch (Public)' })
    @ApiBody({ type: () => UpdateStopwatchDto })
    @UseInterceptors(ClassSerializerInterceptor)
    @Patch('/:id')
    public async update(@Param('id') id: string, @Body() updateDto: UpdateStopwatchDto): Promise<StopwatchDto> {
        const trueId = parseInt(id);
        if (!trueId) throw new BadRequestException(`Stopwatch #${id} is not a number`);
        return await this.stopwatchService.update(trueId, updateDto);
    }

    /**
     * Deletes a stopwatch by its identifier.
     *
     * @param {string} id - The ID of the stopwatch to delete.
     * @return {Promise<string>} A promise that resolves to a confirmation message.
     */
    @ApiOperation({ summary: 'Delete a stopwatch by id (Public)' })
    @ApiOkResponse({ type: String, description: 'Literally Ok', example: 'ok' })
    @ApiParam({ name: 'id', type: Number, description: 'Id of the stopwatch to delete', example: 1 })
    @UseInterceptors(ClassSerializerInterceptor)
    @Delete('/:id')
    public async delete(@Param('id') id: string): Promise<string> {
        const trueId = parseInt(id);
        if (!trueId) throw new BadRequestException(`Stopwatch #${id} is not a number`);
        return await this.stopwatchService.delete(trueId);
    }
}
