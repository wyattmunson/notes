# Cryptography

HTTP v. HTTPS

## Digital Signatures

There is one issue: lack of authentication. Digital sigantures themselves do verify the true identity of the sender and their public key. The solution is **digital certificates**.

## SSL Certificates

SSL certificate is the trust between the brower and the web server. It is issued by a third party and verifies the identity of the web server and its public key. 

Steps 
1. Browser requests `github.com` from web server.
1. Web server returns its public key with its SSL certificate, which is digitally signed by a third party (Certificate Authority)
1. When the browser recieves the certificate, it will check the digital signature against the CA to make sure the cert is valid. The signature is created by a CA's private key. When the CA verifies the certificate the browser can now trust it (a green padlock appears in the address bar).
1. The browser then creates a symmetic key (or shared secret). It sends one copy to the web server, using the web servers public key to decrypt it.
1. When the web server gets the ebcryped symmetrics key. It uses its private key to decrypt it. From now on, all traffic between the web server will be encrypted and decrypted with the same key.

This example shows how asymmetric and symmetric encryption are used together. Asymmetric key algorithm (public and private key) is used to verify the identity of the owner and it's public key so that trust is built. Once the connection is established, symmetric key algorithm (shared key) is used to encrypt and decrypt them.

Remember, the green lock only indicates that the traffic is enrypted. A hacker can also go to a CA and get an SSL cert. Just because the traffic is encrypted, doesn't mean the person at the other end is necessarily trustworthy. 