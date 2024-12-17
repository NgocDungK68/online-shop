import axios from 'axios';
import authHeader from './auth-header';
const EMPLOYEE_API_BASE_URL = "http://localhost:8082/api/employees";

class EmployeeService{

    getAllEmployees(){
        return axios.get(EMPLOYEE_API_BASE_URL, { headers: authHeader() });
    }

    createEmployee(employee){
        return axios.post(EMPLOYEE_API_BASE_URL, employee, { headers: authHeader() });
    }

    getEmployeeById(employeeId){
        return axios.get(EMPLOYEE_API_BASE_URL + '/' + employeeId, { headers: authHeader() });
    }

    updateEmployee(employeeId, employee){ 
        return axios.put(EMPLOYEE_API_BASE_URL + '/' +employeeId, employee, { headers: authHeader() });
    }

    deleteEmployee(employeeId){
        return axios.delete(EMPLOYEE_API_BASE_URL + '/' + employeeId, { headers: authHeader() });
    }

}

export default new EmployeeService()
