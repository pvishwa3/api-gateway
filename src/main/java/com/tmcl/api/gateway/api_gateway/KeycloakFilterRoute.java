package com.tmcl.api.gateway.api_gateway;


import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Component;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

@Configuration
@Component
public class KeycloakFilterRoute extends ZuulFilter {

	private static final String AUTHORIZATION_HEADER = "Authorization";

	@Override
	public String filterType() {
		return "pre";
	}

	@Override
	public int filterOrder() {
		return 0;
	}

	@Override
	public boolean shouldFilter() {
		return true;
	}

	@Override
	public Object run() {
		RequestContext ctx = RequestContext.getCurrentContext();
		if (ctx.getRequest().getHeader(AUTHORIZATION_HEADER) == null) {
			addKeycloakTokenToHeader(ctx);
		}
		

		
		return null	;
	}

	private void addKeycloakTokenToHeader(RequestContext ctx) {
		String securityContext = getRefreshableKeycloakSecurityContext(ctx);
		if (securityContext != null) {
			
			
			ctx.addZuulRequestHeader(AUTHORIZATION_HEADER, buildBearerToken(securityContext));

		}
	}

	private String getRefreshableKeycloakSecurityContext(RequestContext ctx) {

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();


		if (auth instanceof OAuth2Authentication) {
			Object details = auth.getDetails();
			if (details instanceof OAuth2AuthenticationDetails) {
				OAuth2AuthenticationDetails oauth = (OAuth2AuthenticationDetails)details;
				
				return  oauth.getTokenValue();
			}

						
			}
			return null;
		}

		private String buildBearerToken(String securityContext) {
			return "Bearer " + securityContext;
		}
	}
