export interface IBaseRepository<TEntity, TIdentityType> {
    create(data: TEntity): Promise<TIdentityType>
}
