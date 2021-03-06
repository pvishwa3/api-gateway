package com.tmcl.api.gateway.api_gateway;


import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;

/**
 * Created by yfyuan on 2017/3/16.
 */
public class ShareAuthenticationToken extends AbstractAuthenticationToken {

    private User user;

    public ShareAuthenticationToken(User user) {
        super(AuthorityUtils.NO_AUTHORITIES);
        this.user = user;
    }


    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return user;
    }
}
