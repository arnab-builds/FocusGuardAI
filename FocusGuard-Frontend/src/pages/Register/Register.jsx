import { useSearchParams } from "react-router-dom";
import EmployeeRegister from "./EmployeeRegister";
import OrganizationRegister from "../../organization-admin/pages/OrganizationRegister";

export default function Register() {
  const [searchParams] = useSearchParams();
  return searchParams.get("role") === "organization-admin"
    ? <OrganizationRegister />
    : <EmployeeRegister />;
}
