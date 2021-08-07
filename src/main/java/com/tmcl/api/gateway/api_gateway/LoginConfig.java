package com.tmcl.api.gateway.api_gateway;

import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestOperations;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.stereotype.Component;




@Configuration
@EnableOAuth2Sso
@Order(-1)
public class LoginConfig extends WebSecurityConfigurerAdapter {

	//This is needed on the gateway so OAuth2TokenRelayFilter do check the validation of token and refresh it.
	@Bean
	public OAuth2RestOperations  oAuth2RestOperations(OAuth2ClientContext oauth2ClientContext, OAuth2ProtectedResourceDetails details) {
		OAuth2RestTemplate oAuth2RestTemplate = new OAuth2RestTemplate(details, oauth2ClientContext);
		return oAuth2RestTemplate;
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable()
        .authorizeRequests()
				.antMatchers("/","/user/register/**","/user/get-user-details/**", "/assets/**","/css/**","/js/**","/lib/**","/plugins/**", "/register.html","/login.html","/token-expried.html","/invalid-expried.html","/favicon.ico","/user/device-manager/check-for-new-devices/**","/user/device-manager/update-device-status/**","/user/device-manager/check-for-new-devices-for-testing/**","/user/device-manager/collectors/single-collector/**","/user/device-manager/collectors/validate-collector/**","/user/connector-authentication/**","/user/device-manager/collectors/get-all-devices-for-collector/**","/user/device-manager/collectors/save-devices/**","/user/device-manager/collectors/get-all-device-type/**","/user/device-manager/collectors/get-all-log-types/**","/user/device-manager/collectors/disable-devices/**","/user/device-manager/collectors/disable-devices/**","/user/device-manager/collectors/configured-sources/**","/user/device-manager/collectors/delete-devices","/user/device-manager/collectors/heart-beat","/user/device-manager/collectors/update-collector-state","/user/device-manager/collectors/check-for-fwd-request/**","/user/device-manager/collectors/update-fwd-reqest-data","/siem-core/user/panel/download-report/**","/siem-core/user/panel/get-report/**","/siem-core/user/panel/load-single-panel-for-report/**","/siem-core/user/panel/load-single-widget","/reports/**","/obelus/static/**","/user/download-dashboard/**").permitAll()
				.antMatchers("/admin/**","index.html").hasAnyRole("ADMIN")
			.antMatchers("/user/**","/index.html","/secure/**").hasAnyRole("USER")
			.anyRequest().authenticated()
        .and()
        .formLogin()
			.loginPage("/login").defaultSuccessUrl("/home.html#!/incidents")
			.permitAll()
			.and()
        .logout().logoutUrl("/logout").logoutSuccessUrl("/login.html").deleteCookies("JSESSIONID")
			.permitAll();
	}


	private CsrfTokenRepository csrfTokenRepository() {
		HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
		repository.setHeaderName("X-XSRF-TOKEN");
		return repository;
	}

}


