package com.tmcl.api.gateway.api_gateway;


import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;

import io.jsonwebtoken.*;

import java.util.Date;


public class JWTUtil {

    private static final String KEY = "KPscPzLQHby527u5d26UEfjafKFwcJBy9DAN3XeAYCvBkAgqscUG4PHaqYgcyHBxbMaPmeeVumpDxfDz5p7XPEJ4uQSDpjZaGMPTCFEVCDbYKEprEkdjAzXFes9umKeTnUpQbSnDn9dHrsJUpyPzWpQ3FP7RrbApGNPHh3WfMZz348M3wccjsTbWj8DzUQzdudLBRktvVRnPPLtbNw65Z7C9Q7zmMXqRMM5vWnPH5M9JpswNysup9WpAEyM3m2JJ";

    public static String createJWT(String id, String issuer, String subject, long ttlMillis) {


        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);

        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(KEY);
        Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());

        JwtBuilder builder = Jwts.builder().setId(id)
                .setIssuedAt(now)
                .setSubject(subject)
                .setIssuer(issuer)
                .signWith(signatureAlgorithm, signingKey);

        if (ttlMillis >= 0) {
            long expMillis = nowMillis + ttlMillis;
            Date exp = new Date(expMillis);
            builder.setExpiration(exp);
        }

        return builder.compact();
    }

    public static Claims decodeJWT(String jwt) {

        //This line will throw an exception if it is not a signed JWS (as expected)
        Claims claims = Jwts.parser()
                .setSigningKey(DatatypeConverter.parseBase64Binary(KEY))
                .parseClaimsJws(jwt).getBody();
        return claims;
    }

}

