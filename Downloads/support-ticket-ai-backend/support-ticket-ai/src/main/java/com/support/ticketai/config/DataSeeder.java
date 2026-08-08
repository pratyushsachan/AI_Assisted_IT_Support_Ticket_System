package com.support.ticketai.config;

import com.support.ticketai.entity.Role;
import com.support.ticketai.entity.User;
import com.support.ticketai.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds demo users automatically every time the app starts.
 * Since H2 is in-memory, data resets on every restart — this guarantees
 * a working admin + employee accounts are always ready for a demo,
 * without needing to manually register via curl every time.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;

    public DataSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail("admin@company.com")) {
            log.info("Demo users already exist — skipping seed");
            return;
        }

        User admin = User.builder()
                .email("admin@company.com")
                .password("admin123")
                .fullName("Pratyush Sachan")
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);

        User employee1 = User.builder()
                .email("employee1@company.com")
                .password("emp123")
                .fullName("Riya Sharma")
                .role(Role.USER)
                .build();
        userRepository.save(employee1);

        User employee2 = User.builder()
                .email("employee2@company.com")
                .password("emp123")
                .fullName("Arjun Mehta")
                .role(Role.USER)
                .build();
        userRepository.save(employee2);

        User employee3 = User.builder()
                .email("employee3@company.com")
                .password("emp123")
                .fullName("Karan Verma")
                .role(Role.USER)
                .build();
        userRepository.save(employee3);

        log.info("=================================================");
        log.info("Demo users seeded:");
        log.info("  ADMIN:    admin@company.com / admin123");
        log.info("  EMPLOYEE: employee1@company.com / emp123 (Riya Sharma)");
        log.info("  EMPLOYEE: employee2@company.com / emp123 (Arjun Mehta)");
        log.info("  EMPLOYEE: employee3@company.com / emp123 (Karan Verma)");
        log.info("=================================================");
    }
}