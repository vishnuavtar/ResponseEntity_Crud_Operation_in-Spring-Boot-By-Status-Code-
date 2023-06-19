package com.example.demo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {
	
	@Autowired
	private EmployeeRepository employeeRepository;

	public List<Employee> getAllEmployee() {
		
		return  employeeRepository.findAll();
	}

	public Optional<Employee> findById(Long id) {
		
		return employeeRepository.findById(id);
	}

	public Employee updateById(Employee employee, Long id) {
		
		return employeeRepository.save(id);
		
		
	}

	public Employee insert(Employee employee) {
		
		return employeeRepository.save(employee);
	}

	public String deleteById(Long id) {
		employeeRepository.deleteById(id);
		return "deleted id = " + id;
	}

	

}
