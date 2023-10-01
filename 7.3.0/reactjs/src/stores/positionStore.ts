import { action, observable } from 'mobx';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { GetPositionOutput } from '../services/position/dto/getPositionOutput';
import { CreateOrUpdatePositionInput } from '../services/position/dto/createOrUpdatePositionInput';
import positionServie from '../services/position/positionServie';
import { UpdatePositionInput } from '../services/position/dto/updatePositionInput';
import { EntityDto } from '../services/dto/entityDto';
import { PagedPositionResultRequestDto } from '../services/position/dto/PagedPositionResultRequestDto';

class PositionStore {
  @observable positions!: PagedResultDto<GetPositionOutput>;

  @observable editPosition!: CreateOrUpdatePositionInput;

  @action
  async create(createPositionInput: CreateOrUpdatePositionInput) {
    let result = await positionServie.create(createPositionInput);
    this.positions.items.push(result);
  }

  @action
  async update(updatePositionInput: UpdatePositionInput) {
    let result = await positionServie.update(updatePositionInput);
    this.positions.items = this.positions.items.map((x: GetPositionOutput) => {
      if (x.id === updatePositionInput.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await positionServie.delete(entityDto);
    this.positions.items = this.positions.items.filter(
      (x: GetPositionOutput) => x.id !== entityDto.id
    );
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await positionServie.get(entityDto);
    this.editPosition = result;
  }

  @action
  async createPosition() {
    this.editPosition = {
      positionName: '',
      id: 0,
    };
  }

  @action
  async getAll(pagedFilterAndSortRequest: PagedPositionResultRequestDto) {
    let result = await positionServie.getAll(pagedFilterAndSortRequest);
    this.positions = result;
  }
}

export default PositionStore;
