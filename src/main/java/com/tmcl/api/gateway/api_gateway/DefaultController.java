package com.tmcl.api.gateway.api_gateway;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.FileUtils;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class DefaultController{



   

   
    
	

	@RequestMapping(value = {"/"})
    public String index(Principal p) {
        if(p==null) {
			return "welcome.html";
		}
		return "index.html";
    }
	@RequestMapping(value = {"/rules"})
	public String rules(Principal p) {

		return "index.html";
	}

    @RequestMapping(value = {"/dashboard/{**}"})
    public String users() {
        return "/";

	}
	@RequestMapping(value = {"/explore"})
	public String displayExplorePage() {
		return "/";

	}

	//explore

	@RequestMapping(value = {"/historical"})
    public String historical() {
        return "/";
	}

	@RequestMapping(value = "/detections")
	public String displayML() {
		return "/";
	}

	@RequestMapping(value = "/detections/{id}")
	public String displayMLNextPage() {
		return "/";
	}

	@RequestMapping(value = "/integrations")
	public String displayIntegrationsPage() {
		return "/";
	}


	@RequestMapping(value = {"/threat-intel"})
	public String displayThreatIntel() {
		return "/";
	}
	@RequestMapping(value = {"/cases"})
    public String cases() {
        return "/";
	}
	@RequestMapping(value = {"/dashboards"})
    public String dashboard() {
        return "/";
	}

	@RequestMapping(value = {"/brand-monitor"})
	 public String brandMointor() {
        return "/";
	}

	@RequestMapping(value = "/playbook")
	public String displayPlaybooks() {

		return "/index.html";
	}
	@RequestMapping(value = "/playbook/edit/{id}")
	public String displayEditPlaybooks() {

		return "/index.html";
	}
	@RequestMapping(value = "/reports/{id}")
	public String displayReports() {

		return "/index.html";
	}


	@RequestMapping(value = "/configuration")
    public String org() {

		return "/configuration.html";
    }



	@RequestMapping(value = "/profile")
	public String displayProfile() {

		return "/";
	}


	
	@RequestMapping(value="/user-logout")
	protected void navigateLogOutURL(HttpServletRequest request,HttpServletResponse response) throws IOException {

		HttpSession httpSession = request.getSession(false);
		if(httpSession!=null) {
			httpSession.invalidate();
		}
		for(Cookie cookie : request.getCookies()) {
			if(cookie.getName() == "JSESSIONID") {
				//Clear one cookie
				cookie.setValue("");
				cookie.setMaxAge(0);
				cookie.setPath(request.getContextPath());
				response.addCookie(cookie);

			}
		}
		String appUrl = getAppUrl(request)+"/login";

		response.sendRedirect("http://ec2-34-205-159-10.compute-1.amazonaws.com:8010/auth/realms/technominds/protocol/openid-connect/logout?redirect_uri="+appUrl);
	}
	
	private String getAppUrl(HttpServletRequest request) {
		return "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
	}
	
	
}
