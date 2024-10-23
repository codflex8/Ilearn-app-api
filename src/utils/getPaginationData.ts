import { BaseEntity } from "typeorm";

export const getPaginationData = <T extends BaseEntity>({
  page,
  pageSize,
}: //   model,
//   condition,
{
  page;
  pageSize;
  //   model: T;
  //   condition;
}) => {
  const take = pageSize ?? 10;
  const skip = ((page ?? 1) - 1) * take;
  //   const count = model.count({
  //     where: condition,
  //   });
  return { skip, take };
};
