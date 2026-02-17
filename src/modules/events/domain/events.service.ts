import { EventsRepository } from "./events.repository.js";
import { CreateEvent, FindEvents } from "./events.types.js";

export class EventsService {
    constructor(private eventsRepository: EventsRepository) {}

    async create(data: CreateEvent) {
        return await this.eventsRepository.create(data);
    }

    async find(data: FindEvents) {
        return await this.eventsRepository.find(data);
    }
}
