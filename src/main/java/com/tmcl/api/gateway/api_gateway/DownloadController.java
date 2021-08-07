package com.tmcl.api.gateway.api_gateway;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

import io.jsonwebtoken.Claims;
import org.apache.commons.io.FileUtils;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/user")
public class DownloadController {

	@GetMapping(value = "/download-report/{id}")
	public ResponseEntity<Object> downloadReport(@PathVariable("id") long id,
												 @RequestParam(value = "startDate") long startDate,
												 @RequestParam(value = "endDate") long endDate,
												 @RequestParam(value = "token") String token,
												 HttpServletRequest httpRequest) throws Exception {


			return generatePdf(id,startDate,endDate,token);



	}

    @GetMapping(value = "/download-dashboard/{id}") 
    public  ResponseEntity<Object> downloadDashboard(@PathVariable("id") long id,
													 @RequestParam(value = "startDate") long startDate,
													 @RequestParam(value = "endDate") long endDate,
													 @RequestParam(value = "token") String token
		) throws Exception{
       	return generatePdf(id,startDate,endDate,token);
    }

    private ResponseEntity<Object> generatePdf(long id,long startDate,long endDate,String token) throws Exception {
		String fileName = PDFGenerate.generatePDF(id, startDate, endDate,token);
		File source = new File(fileName);
		if(source.exists()) {
			File dest = new File(id+".pdf");
			FileUtils.copyFile(source, dest);
			Path path = Paths.get(dest.getAbsolutePath());
			ByteArrayResource resource = new ByteArrayResource(java.nio.file.Files.readAllBytes(path));

			HttpHeaders headers = new HttpHeaders();
			headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
			headers.add("Pragma", "no-cache");
			headers.add("Expires", "0");
			return ResponseEntity.ok()
					.headers(headers)
					.contentLength(dest.length())
					.contentType(MediaType.parseMediaType("application/pdf"))
					.body(resource);
		}
		return ResponseEntity.badRequest().build();
	}

}
