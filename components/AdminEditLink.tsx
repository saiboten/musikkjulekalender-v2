import NextLink from "next/link";
import { Admin } from "./Admin";
import { EditIcon } from "./ui";

export const AdminEditLink = ({ id }: { id: number }) => (
  <Admin>
    <NextLink
      href={`/edit/${id}`}
      className="flex items-center hover:underline"
    >
      <EditIcon className="mr-2" />
      <span>Endre dag</span>
    </NextLink>
  </Admin>
);
