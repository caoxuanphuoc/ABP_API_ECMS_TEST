import { action, observable } from 'mobx';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { GetRoomOutput } from '../services/room/dto/getRoomOutput';
import roomService from '../services/room/roomService';
import { EntityDto } from '../services/dto/entityDto';
import { PagedRoomResultRequestDto } from '../services/room/dto/PagedRoomResultRequestDto';
import { CreateOrUpdateRoomInput } from '../services/room/dto/createOrUpdateRoomInput';

class RoomStore {
  @observable rooms!: PagedResultDto<GetRoomOutput>;

  @observable editRoom!: CreateOrUpdateRoomInput;

  @action
  async create(createRoomInput: CreateOrUpdateRoomInput) {
    let result = await roomService.create(createRoomInput);
    this.rooms.items.push(result);
  }

  @action
  async update(updateRoomInput: CreateOrUpdateRoomInput) {
    let result = await roomService.update(updateRoomInput);
    this.rooms.items = this.rooms.items.map((x: GetRoomOutput) => {
      if (x.id === updateRoomInput.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await roomService.delete(entityDto);
    this.rooms.items = this.rooms.items.filter((x: GetRoomOutput) => x.id !== entityDto.id);
  }

  @action
  async get(entiyDto: EntityDto) {
    let result = await roomService.get(entiyDto);
    this.editRoom = result;
  }

  @action
  async createRoom() {
    this.editRoom = {
      roomName: '',
      maxContainer: 0,
      id: 0,
    };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedRoomResultRequestDto) {
    let result = await roomService.getAll(pagedFilterAndSortedRequest);
    this.rooms = result;
  }
}

export default RoomStore;
