import { expect } from 'chai';
import 'mocha';
import { createSandbox } from 'sinon';
import Container from "typedi";
import { RoomType } from '../../../../domain/aggregateRoots/RoomType';
import { RoomTypeName } from "../../../../domain/valueObjects/room-type/RoomTypeName";
import { RoomTypePrice } from "../../../../domain/valueObjects/room-type/RoomTypePrice";
import { CreateRoomTypeUseCase } from "./CreateRoomTypeUseCase";
import { CreateRoomTypeCommand } from './CreateRoomTypeCommand';
import { IRoomTypeRepository } from '../../../../infra/adapter/IRoomTypeRepository';
import { CreateRoomTypeErrors } from './CreateRoomTypeErrors';

const generateRoomType = () => {
    const name = RoomTypeName.create({ value: 'ROOM-TEST' }).getValue()
    const price = RoomTypePrice.create({ value: 123000 }).getValue()
    return RoomType.create({ name, price }).getValue()
};

Container.set('room_type.repository', {
    async isNameExist() { },
    async create() { },
});

const roomTypeRepository = Container.get<IRoomTypeRepository>('room_type.repository');
const createRoomTypeUseCase = Container.get(CreateRoomTypeUseCase)

describe('Room type - Create room type', () => {
    const sandbox = createSandbox()
    let roomType: RoomType

    beforeEach(() => {
        roomType = generateRoomType()
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('Create room type without name', async () => {
        const param = new CreateRoomTypeCommand()

        const result = await createRoomTypeUseCase.handler(param).catch(err => err)
        if (result.isLeft())
            expect(result.value.errorValue()).to.include('The room type name is null or empty')
    })

    it('Create room type with length name greater than 10 characters', async () => {
        const param = new CreateRoomTypeCommand()
        param.name = "0"

        const result = await createRoomTypeUseCase.handler(param).catch(err => err)
        if (result.isLeft())
            expect(result.value.errorValue()).to.include('The length of room type name is between 3 and 10')
    })

    it('Create room type with name has exists', async () => {
        sandbox.stub(roomTypeRepository, 'isNameExist').resolves(true);
        const param = new CreateRoomTypeCommand()
        param.name = 'ROOM-001'

        const result = await createRoomTypeUseCase.handler(param).catch(err => err)
        if (result.isLeft())
            expect(result.value.constructor).to.include(CreateRoomTypeErrors.NameAlreadyExist)
    });

    it('Create room type with data cannot save', async () => {
        sandbox.stub(roomTypeRepository, 'isNameExist').resolves(false);
        sandbox.stub(roomTypeRepository, 'create').resolves(null);
        const param = new CreateRoomTypeCommand();
        param.name = 'ROOM TEST';

        const result = await createRoomTypeUseCase.handler(param).catch(error => error);
        if (result.isLeft())
            expect(result.value.constructor).to.include(CreateRoomTypeErrors.DataCannotSave)
    });

    it('Create room type successfully', async () => {
        sandbox.stub(roomTypeRepository, 'isNameExist').resolves(false);
        sandbox.stub(roomTypeRepository, 'create').resolves(roomType.id.toString());
        const param = new CreateRoomTypeCommand();
        param.name = 'ROOM TEST';
        param.price = 12345

        const id = await createRoomTypeUseCase.handler(param);
        expect(id.value.getValue()).to.eq(roomType.id.toString());
    });
})