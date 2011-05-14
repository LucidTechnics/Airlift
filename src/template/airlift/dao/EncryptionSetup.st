var password = SERVLET.getServletConfig().getInitParameter("a.cipher.password");
var initialVector = SERVLET.getServletConfig().getInitParameter("a.cipher.initial.vector");
var revolutions = SERVLET.getServletConfig().getInitParameter("a.cipher.revolutions")||20;
