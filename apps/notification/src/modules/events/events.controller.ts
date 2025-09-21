import { Controller, Post } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Controller('/events')
export class EventsController {
  constructor(private readonly eventsGateway: EventsGateway) {}

  @Post()
  sendEvent() {
    this.eventsGateway.send();
  }
}
