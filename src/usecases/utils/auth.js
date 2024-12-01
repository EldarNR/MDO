import { useRouter } from "vue-router";

export function checkAuth() {
  const router = useRouter();
  const token = localStorage.getItem("tokken");
  const employee_id = localStorage.getItem("employee_id");
  if (!token && !employee_id) {
    router.push("/login");
  }
}
