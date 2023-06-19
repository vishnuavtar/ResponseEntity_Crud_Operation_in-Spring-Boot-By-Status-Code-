package com.example.demo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/")
public class EmployeeController {

	@Autowired
	private EmployeeService service;

	@GetMapping("/employees")
	public ResponseEntity<Optional<List<Employee>>> getallEmployees() {

		List<Employee> employee = service.getAllEmployee();

		if (employee.size() <= 0) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		return ResponseEntity.ok(Optional.of(employee));

		// return employeeRepository.findAll();
	}

	@PostMapping("/employees")
	public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {

		Employee ee = null;

		try {
			ee = service.insert(employee);
			return ResponseEntity.of(Optional.of(ee));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@GetMapping("/employees/{id}")
	public ResponseEntity<Optional<Optional<Employee>>> getEmployeeById(@PathVariable Long id) {

		Optional<Employee> employee = service.findById(id);

		if (employee.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		return ResponseEntity.ok(Optional.of(employee));

	}

	@PutMapping("/employees/{id}")
	public ResponseEntity<Employee> updateEmployee( @RequestBody Employee employee , @PathVariable("id") Long id) { // @RequestBody
																											// Employee
																											// employeeDetails

		try {

			employee = service.updateById(employee, id);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}

//		if(employee == null) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//		}
//		
//		return ResponseEntity.ok(Optional.of(employee));

//		Employee employee = employeeRepository.findById(id).orElseThrow(()-> new ResourseNotFoundException("Employee not exist with id : " + id));
//		employee.setFirstName(employeeDetails.getFirstName());
//		employee.setLastName(employeeDetails.getLastName());
//		employee.setEmailId(employeeDetails.getEmailId());
//		
//		Employee updateEmployee = employeeRepository.save(employee);
//		return ResponseEntity.ok(updateEmployee);

	}

	@DeleteMapping("/employees/{id}")
	public ResponseEntity<String> deleteById(@PathVariable Long id) {

		String ee = null;

		try {
			ee = service.deleteById(id);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

}
