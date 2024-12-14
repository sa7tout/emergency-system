package com.ambulance.ambulance.config;

import com.ambulance.common.security.config.JwtUtil;
import com.ambulance.common.security.filter.BaseJwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthenticationFilter extends BaseJwtAuthenticationFilter {

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        super(jwtUtil);
    }

    @Override
    protected void processJwtAuthentication(HttpServletRequest request, String jwt, String username) {
        if (jwtUtil.validateToken(jwt)) {
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    jwtUtil.extractAuthorities(jwt)
            );
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
    }
}
