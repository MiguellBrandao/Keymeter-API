// src/common/http/serialize.ts
type DtoMapper<TInput, TOutput> = {
  from: (data: TInput) => TOutput
}

export function serialize<TInput, TOutput>(
  data: TInput,
  dto: DtoMapper<TInput, TOutput>,
): TOutput {
  return dto.from(data)
}

export function serializeList<TInput, TOutput>(
  data: TInput[],
  dto: DtoMapper<TInput, TOutput>,
): TOutput[] {
  return data.map(dto.from)
}
