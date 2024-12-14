package com.ambulance.auth.service;

import com.ambulance.auth.entity.Employee;
import com.ambulance.auth.entity.User;
import com.ambulance.auth.repository.EmployeeRepository;
import com.ambulance.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // First try to find admin user
        Optional<User> adminUser = userRepository.findByUsername(username);
        if (adminUser.isPresent()) {
            User user = adminUser.get();
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    user.getRoles().stream()
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                            .collect(Collectors.toSet())
            );
        }

        Optional<Employee> employee = employeeRepository.findByEmployeeId(username);
        if (employee.isPresent()) {
            Employee emp = employee.get();
            return new org.springframework.security.core.userdetails.User(
                    emp.getEmployeeId(),
                    emp.getPin(),
                    Collections.singleton(new SimpleGrantedAuthority("ROLE_" + emp.getRole()))
            );
        }

        throw new UsernameNotFoundException("User not found");
    }
}