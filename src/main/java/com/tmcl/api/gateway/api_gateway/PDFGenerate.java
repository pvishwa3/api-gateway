package com.tmcl.api.gateway.api_gateway;

import java.io.File;
import java.io.FileOutputStream;

import javax.imageio.ImageIO;

import com.google.common.io.Files;
import com.itextpdf.awt.geom.Rectangle;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.text.Document;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.PdfDocument;
import com.itextpdf.text.pdf.PdfWriter;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import ru.yandex.qatools.ashot.AShot;
import ru.yandex.qatools.ashot.Screenshot;
import ru.yandex.qatools.ashot.shooting.ShootingStrategies;

public class PDFGenerate {
    
    public static String generateScreenShot(long id,long startDate,long endDate,String token) throws Exception{

        File myTempDir = Files.createTempDir();

	      String screenShotName = myTempDir.getAbsolutePath()+"/"+id+"-"+System.currentTimeMillis()+".png";

        String chromeDriverPath = "/home/prasanth/chromedriver_4" ;
        System.setProperty("webdriver.chrome.driver", chromeDriverPath);
        ChromeOptions options = new ChromeOptions();

        options.addArguments("start-maximized"); // open Browser in maximized mode
        options.addArguments("disable-infobars"); // disabling infobars
        options.addArguments("--disable-extensions"); // disabling extensions
        options.addArguments("--disable-gpu"); // applicable to windows os only
        options.addArguments("--disable-dev-shm-usage"); // overcome limited resource problems
        options.addArguments("--no-sandbox"); // Bypass OS security model
        options.addArguments("--headless");
        options.addArguments("--window-size=1920,1200");
        options.addArguments("--ignore-certificate-errors");
        options.addArguments("--silent");
        // options.addArguments("--headless", "--disable-gpu", "--window-size=1920,1200","--ignore-certificate-errors", "--silent");
        //
        WebDriver driver = new ChromeDriver(options);

        String url = "http://localhost:8081/reports/"+id+"?startDate="+startDate+"&endDate="+endDate+"&generateBy=System&token="+token;

        driver.get(url);

        System.out.println("url>>>"+url);

        Thread.sleep(12000);
        Object output = ((JavascriptExecutor) driver).executeScript("return window.devicePixelRatio");
        String value = String.valueOf(output);
        float windowDPR = Float.parseFloat(value);
        Screenshot fpScreenshot = new AShot().shootingStrategy(ShootingStrategies.viewportPasting(ShootingStrategies.scaling(windowDPR), 100)).takeScreenshot(driver);

        File screenShot = new File(screenShotName);

        ImageIO.write(fpScreenshot.getImage(),"PNG",screenShot);
        driver.close();
        return screenShotName;
    }

    public static String generatePDF(long id,long startDate,long endDate,String token) throws Exception{
    
        String screenShotPath = generateScreenShot(id, startDate, endDate,token);
        Image image = Image.getInstance(screenShotPath);
        com.itextpdf.text.Rectangle pagesize = new com.itextpdf.text.Rectangle(image.getWidth()+100,image.getHeight()+50);
        Document document = new Document(pagesize);
        File myTempDir = Files.createTempDir();
        String screenpdfShotName = myTempDir.getAbsolutePath()+"/"+id+"-"+System.currentTimeMillis()+".pdf";

        PdfWriter.getInstance(document, new FileOutputStream(screenpdfShotName));

        document.open();
 
        // Get instance of Image and then add it in document
       
        document.add(image); 
        document.close();
        File existingFile = new File(screenShotPath);
        existingFile.deleteOnExit();
        return screenpdfShotName;
             
    }



}
