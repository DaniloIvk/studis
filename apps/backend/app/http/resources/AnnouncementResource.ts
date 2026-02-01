import { Announcements } from '../../../database/prisma/client';
import Resource from '../../core/http/Resource';

class AnnouncementResource extends Resource<Announcements> {
  public serialize(): object {
    return {
      id: this.resource.id,
      title: this.resource.title,
      description: this.resource.description,
      createdAt: this.resource.createdAt,
    };
  }
}

export default AnnouncementResource;
