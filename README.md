#   M i l l w a r d   B r o w n   D i g i t a l  
 # #   S e l f - H o s t   J a v a S c r i p t   T r a c k i n g  
  
 U s e   o u r   c l i e n t - b a s e d   t r a c k i n g   t e c h n o l o g y   h o s t e d   i n   y o u r   o w n   s e r v e r s .  
  
 O v e r v i e w  
 - - -  
 T h e   t r a c k i n g   o b j e c t   a l l o w s   y o u   t o   r e c o r d   t r a c k i n g   d a t a   i n   l o c a l S t o r a g e   a n d   t h e n   i n v i t e   r e s p o n d e n t s   f r o m   y o u r   s i t e   w i t h o u t   u s i n g   a n   e x t e r n a l   s c r i p t   l i b r a r i e s .   A l l   t r a c k i n g   c o d e   i s   e d i t a b l e   a n d   h o s t e d   o n   y o u r   o w n   s e r v e r .  
  
 T r a c k i n g   i s   a c c o m p l i s h e d   b y   c r e a t i n g   a n   i n s t a n c e   o f   t h e   M B D   t r a c k i n g   s y s t e m   w i t h   o p t i o n a l l y   s p e c i f i e d   d e f a u l t   s e t t i n g s   a n d   t h e n   r e c o r d i n g   o n e   o r   m o r e   i m p r e s s i o n s   b y   c a l l e d    
  
         . R e c o r d I m p r e s s i o n ( c a m p a i g n I d ,   {   a d d i t i o n a l :   v a l u e ,   a d d i t i o n a l :   v a l u e   } ) .  
  
 c a m p a i g n I d   w i l l   b e   a s s i g n e d   t o   y o u r   c a m p a i g n   a s   a   u n i q u e   v a l u e   s o   t h a t   m u l t i p l e   c a m p a i g n s   c a n   b e   t r a c k e d   a n d   s o   t h a t   w h e n   i n v i t a t i o n s   a r e   i s s s u e d ,   a   r e c o r d   i s   r e c o r d e d   o f   w h i c h   c a m p a i g n s   a   r e s p o n d e n t   h a s   b e e n   i n v i t e d   f o r .    
  
 T h e   i n v i t a t i o n   c a n   b e   c u s t o m i z e d   e i t h e r   b y   e d i t i n g   M B D . j s   o r   b y   p a s s i n g   o v e r r i d e   s e t t i n g s   i n   t h e   i n i t i a l i z a t i o n   c a l l .    
  
  
 S a m p l e  
 - - -  
  
         < s c r i p t   s r c = " . / M B D . j s " > < / s c r i p t >  
         < s c r i p t >  
         	 / /   C a l l   i n   I I F E   t o   a v o i d   n a m e   c o n f l i c t s  
         	 ( f u n c t i o n ( )   {  
             	         / /   t h i s   v a l u e   t o   b e   p r o v i d e d   b y   M B D  
         	 	 v a r   c a m p a i g n I d   =   1 2 3 4 5 ;    
         	 	  
         	 	 v a r   m b d   =   n e w   M B D ( {  
         	 	 	 l o g g i n g :   t r u e ,  
         	 	 	 r a n d o m I n v i t e P e r c e n t :   0 ,  
         	 	 	 r e m o t e T r a c k i n g :   t r u e  
         	 	 } ) ;  
         	 	  
         	 	 / /   a c t u a l l y   r e c o r d   a n   i m p r e s s i o n  
         	 	 m b d . R e c o r d I m p r e s s i o n ( c a m p a i g n I d ,   {  
         	 	 	 c r e a t i v e I d :   ' c r e a t i v e - 1 2 3 ' ,    
         	 	 	 p l a c e m e n t I d :   ' h o m e - p a g e - h e r o ' ,  
         	 	 	 a c t i o n I D :   1  
         	 	 } ) ;  
         	 	  
         	 	 / /   f o r c e   a n   i n v i t e   t o   s h o w   f o r   c a m p a i g n  
         	 	 m b d . S h o w I n v i t e ( 1 2 3 4 5 ) ;  
         	 } ) ( ) ; 	  
         < / s c r i p t >  
  
  
 