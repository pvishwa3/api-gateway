package com.tmcl.api.gateway.api_gateway;

import java.io.IOException;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

@Component
public class LocalSecurityFilter implements Filter {

	private Logger LOG = LoggerFactory.getLogger(this.getClass());
	private static String context = "";
	private static String schema = "";
	private static LoadingCache<String, String> sidCache = CacheBuilder.newBuilder().expireAfterAccess(3, TimeUnit.MINUTES).build(new CacheLoader<String, String>() {
		@Override
		public String load(String key) throws Exception {
			return null;
		}
	});

	public static void put(String sid, String uid) {
		sidCache.put(sid, uid);
	}

	public static String getContext() {
		return context;
	}

	public static String getSchema() {
		return schema;
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {

	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
		HttpServletRequest hsr = (HttpServletRequest) servletRequest;
		if (StringUtils.isBlank(context) || StringUtils.isBlank(schema)) {
			context = hsr.getLocalPort() + hsr.getContextPath();
			schema = hsr.getScheme();
		}
		if ("/dashboard-report.html".equals(hsr.getServletPath())) {
			String sid = hsr.getParameter("sid");
			try {
				

				User user = new User("viswa@technominds.net", "", new ArrayList<>());
				user.setUserId("viswa@technominds.net");
				SecurityContext context = SecurityContextHolder.getContext();
				context.setAuthentication(new ShareAuthenticationToken(user));
				hsr.getSession().setAttribute("SPRING_SECURITY_CONTEXT", context);

			} catch (Exception e) {
				e.printStackTrace();
				LOG.error("", e);
			}
		}
		filterChain.doFilter(servletRequest, servletResponse);
	}

	@Override
	public void destroy() {

	}
}