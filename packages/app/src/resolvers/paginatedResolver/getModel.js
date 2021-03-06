import Model from '../../Model'
import hash from './hash'
import resolver from '../resolver'

export default ({returns}) => {
  const getTotalCount = async function(paginated) {
    if (typeof paginated.count === 'undefined') {
      paginated.count = await paginated.cursor.count()
    }
    return paginated.count
  }

  const _id = resolver({
    name: '_id',
    returns: 'ID',
    async resolve({params}, viewer) {
      const num = hash({
        typename: returns.name,
        userId: viewer.userId,
        params: params
      })
      return Math.abs(num)
    }
  })

  const totalCount = resolver({
    name: 'totalCount',
    returns: 'integer',
    resolve: getTotalCount
  })

  const totalPages = resolver({
    name: 'totalPages',
    returns: 'integer',
    async resolve(paginated) {
      const count = await getTotalCount(paginated)
      return Math.ceil(count / paginated.options.limit)
    }
  })

  const hasNextPage = resolver({
    name: 'hasNextPage',
    returns: Boolean,
    async resolve(paginated) {
      const count = await getTotalCount(paginated)
      const {skip, limit} = paginated.options
      return skip + limit < count
    }
  })

  const hasPreviousPage = resolver({
    name: 'hasPreviousPage',
    returns: Boolean,
    async resolve(paginated) {
      const count = await getTotalCount(paginated)
      const {skip} = paginated.options
      return count && skip !== 0
    }
  })

  const items = resolver({
    name: 'items',
    returns: [returns],
    async resolve({cursor}) {
      return await cursor.toArray()
    }
  })

  return new Model({
    name: `Paginated${returns.name}`,
    resolvers: {
      _id,
      totalCount,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      items
    }
  })
}
