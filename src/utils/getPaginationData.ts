import { BaseEntity } from "typeorm";

export const getPaginationData = <T extends BaseEntity>({
  page,
  pageSize,
}: {
  page;
  pageSize;
}) => {
  const take = pageSize ?? 10;
  const skip = ((page ?? 1) - 1) * take;
  return { skip, take };
};
