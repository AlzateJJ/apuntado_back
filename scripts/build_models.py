"""Modelos vectoriales editables (SVG y diagrams.net) y PNG de impresión.
Requiere Python, reportlab y pypdfium2. No modifica documentos anteriores.
"""
from pathlib import Path
from xml.etree.ElementTree import Element, SubElement, tostring
from html import escape
import json, math
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
import pypdfium2 as pdfium
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/models';OUT.mkdir(parents=True,exist_ok=True)
FONTS=Path('C:/Windows/Fonts')
if FONTS.exists():
    pdfmetrics.registerFont(TTFont('Model','C:/Windows/Fonts/calibri.ttf'))
    pdfmetrics.registerFont(TTFont('ModelBold','C:/Windows/Fonts/calibrib.ttf'))
else:
    pdfmetrics.registerFont(TTFont('Model','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
    pdfmetrics.registerFont(TTFont('ModelBold','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
INK='#183044';FILL='#edf2f5';BLUE='#275777'
class D:
    def __init__(self,name,w=1100,h=800):
        self.sy=0.82 if ('mesa' in name or 'liquidacion' in name) else 1
        h=round(h*self.sy)
        self.name,self.w,self.h=name,w,h;self.n=1
        self.c=canvas.Canvas(str(OUT/(name+'.pdf')),pagesize=(w,h));self.c.setTitle(name)
        self.svg=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><rect width="100%" height="100%" fill="white"/>']
        self.mx=Element('mxfile',host='app.diagrams.net');dia=SubElement(self.mx,'diagram',name=name,id=name)
        model=SubElement(dia,'mxGraphModel',page='1',pageWidth=str(w),pageHeight=str(h));self.rt=SubElement(model,'root')
        SubElement(self.rt,'mxCell',id='0');SubElement(self.rt,'mxCell',id='1',parent='0')
    def vertex(self,x,y,w,h,value,style):
        self.n+=1;e=SubElement(self.rt,'mxCell',id=str(self.n),value=value,style=style,vertex='1',parent='1')
        SubElement(e,'mxGeometry',x=str(x),y=str(y),width=str(w),height=str(h),attrib={'as':'geometry'})
    def rect(self,x,y,w,h,fill=FILL,rounded=False):
        y,h=y*self.sy,h*self.sy
        self.c.setStrokeColor(HexColor(INK));self.c.setFillColor(HexColor(fill));self.c.setLineWidth(1.5)
        if rounded:self.c.roundRect(x,self.h-y-h,w,h,10,stroke=1,fill=1)
        else:self.c.rect(x,self.h-y-h,w,h,stroke=1,fill=1)
        self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{10 if rounded else 0}" fill="{fill}" stroke="{INK}" stroke-width="1.5"/>')
        self.vertex(x,y,w,h,'',f'rounded={int(rounded)};whiteSpace=wrap;html=1;fillColor={fill};strokeColor={INK};')
    def text(self,x,y,s,size=15,bold=False,align='left',color=INK):
        y=y*self.sy
        self.c.setFillColor(HexColor(color));self.c.setFont('ModelBold' if bold else 'Model',size)
        for i,line in enumerate(s.split('\n')):
            yy=y+i*size*1.23*self.sy
            fn=self.c.drawCentredString if align=='center' else self.c.drawString
            fn(x,self.h-yy,line)
            anchor='middle' if align=='center' else 'start'
            self.svg.append(f'<text x="{x}" y="{yy}" text-anchor="{anchor}" font-family="Calibri,Arial" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}">{escape(line)}</text>')
        width=max(len(l) for l in s.split('\n'))*size*.55+12
        self.vertex(x-width/2 if align=='center' else x,y-size,width,size*1.23*len(s.split('\n')),s,f'text;html=0;strokeColor=none;fillColor=none;align={align};verticalAlign=top;whiteSpace=wrap;rounded=0;fontFamily=Calibri;fontSize={size};fontStyle={1 if bold else 0};fontColor={color};')
    def line(self,pts,dash=False,width=1.5):
        pts=[(x,y*self.sy) for x,y in pts]
        self.c.setStrokeColor(HexColor(INK));self.c.setLineWidth(width);self.c.setDash(6,4) if dash else self.c.setDash()
        p=self.c.beginPath();p.moveTo(pts[0][0],self.h-pts[0][1])
        for x,y in pts[1:]:p.lineTo(x,self.h-y)
        self.c.drawPath(p);self.c.setDash()
        dashsvg=' stroke-dasharray="6,4"' if dash else ''
        self.svg.append(f'<polyline points="{" ".join(f"{x},{y}" for x,y in pts)}" fill="none" stroke="{INK}" stroke-width="{width}"{dashsvg}/>')
        self.n+=1;e=SubElement(self.rt,'mxCell',id=str(self.n),edge='1',parent='1',style=f'endArrow=none;html=1;rounded=0;strokeColor={INK};dashed={int(dash)};')
        g=SubElement(e,'mxGeometry',relative='1',attrib={'as':'geometry'})
        SubElement(g,'mxPoint',x=str(pts[0][0]),y=str(pts[0][1]),attrib={'as':'sourcePoint'})
        SubElement(g,'mxPoint',x=str(pts[-1][0]),y=str(pts[-1][1]),attrib={'as':'targetPoint'})
        arr=SubElement(g,'Array',attrib={'as':'points'})
        for x,y in pts[1:-1]:SubElement(arr,'mxPoint',x=str(x),y=str(y))
    def circle(self,x,y,r=8):
        self.c.setFillColor(HexColor('#ffffff'));self.c.setStrokeColor(HexColor(INK));self.c.circle(x,self.h-y,r,fill=1)
        self.svg.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="white" stroke="{INK}" stroke-width="1.5"/>')
        self.vertex(x-r,y-r,r*2,r*2,'',f'ellipse;fillColor=#ffffff;strokeColor={INK};')
    def arc(self,x,y,r,start,end):
        self.line([(x+r*math.cos(math.radians(a)),y+r*math.sin(math.radians(a))) for a in range(start,end+1,5)])
    def save(self):
        self.c.save();self.svg.append('</svg>');(OUT/(self.name+'.svg')).write_text('\n'.join(self.svg),encoding='utf-8')
        (OUT/(self.name+'.drawio')).write_bytes(tostring(self.mx,encoding='utf-8',xml_declaration=True))
        doc=pdfium.PdfDocument(str(OUT/(self.name+'.pdf')));doc[0].render(scale=2.5).to_pil().save(OUT/(self.name+'.png'));doc.close()

# name: (attribute name, SQL type, PK, nullable)
E={
'rule_profile':[('profile_id','text',1,0),('mode','text',0,0),('version','integer',0,0),('deck_count','smallint',0,0),('hand_size','smallint',0,0),('max_players','smallint',0,0)],
'game':[('game_id','uuid',1,0),('profile_id','text',0,0),('status','text',0,0),('version','integer',0,0),('created_at','timestamptz',0,0)],
'player':[('player_id','uuid',1,0),('display_name','varchar(60)',0,0)],
'participation':[('game_id','uuid',1,0),('player_id','uuid',1,0),('seat','smallint',0,0)],
'round':[('game_id','uuid',1,0),('round_no','integer',1,0),('status','text',0,0),('phase','text',0,0),('turn_player_id','uuid',0,0)],
'card_copy':[('game_id','uuid',1,0),('card_no','smallint',1,0),('deck','smallint',0,0),('suit','char(1)',0,0),('rank','smallint',0,0)],
'card_position':[('game_id','uuid',1,0),('round_no','integer',1,0),('card_no','smallint',1,0),('zone','text',0,0),('owner_id','uuid',0,1),('ordinal','smallint',0,0)],
'round_result':[('game_id','uuid',1,0),('round_no','integer',1,0),('actor_id','uuid',0,0),('closure','text',0,0),('winner_id','uuid',0,1),('next_action','text',0,0),('committed_version','integer',0,0)],
'score_movement':[('game_id','uuid',1,0),('round_no','integer',1,0),('player_id','uuid',1,0),('delta','integer',0,0)],
'processed_operation':[('game_id','uuid',1,0),('operation_id','varchar(128)',1,0),('actor_id','uuid',0,0),('fingerprint','text',0,0),('response','jsonb',0,0)],
'outbox':[('event_id','text',1,0),('game_id','uuid',0,0),('version','integer',0,0),('event_type','text',0,0),('created_at','timestamptz',0,0),('delivered_at','timestamptz',0,1)]}
(OUT/'entities.json').write_text(json.dumps(E,ensure_ascii=False,indent=2),encoding='utf-8')
FK={
 'game':{'profile_id'},'participation':{'game_id','player_id'},
 'round':{'game_id','turn_player_id'},'card_copy':{'game_id'},
 'card_position':{'game_id','round_no','card_no','owner_id'},
 'round_result':{'game_id','round_no','actor_id','winner_id'},
 'score_movement':{'game_id','round_no','player_id'},
 'processed_operation':{'game_id','actor_id'},'outbox':{'game_id'}}
def entity(d,name,x,y,w=300,uml=False,stub=False):
    attrs=E[name] if not stub else [a for a in E[name] if a[2]]
    h=48+len(attrs)*21;d.rect(x,y,w,h,rounded=not uml,fill='#ffffff');d.text(x+w/2,y+23,name if uml else name.upper(),17,True,'center')
    d.line([(x,y+34),(x+w,y+34)])
    for i,(n,t,pk,null) in enumerate(attrs):
        keys=(["PK"] if pk else [])+(["FK"] if n in FK.get(name,set()) else [])
        text=f'+ {n}: {t}'+(' [0..1]' if null else '')+(' {'+', '.join(keys)+'}' if keys else '') if uml else f'{"#" if pk else "o" if null else "*"} {n}'+(' (FK)' if n in FK.get(name,set()) else '')
        d.text(x+12,y+57+i*21,text,14)
    return (x,y,w,h)
def crow(d,end,prev):
    x,y=end;px,py=prev;a=math.atan2(py-y,px-x);length=17
    bx=x+length*math.cos(a);by=y+length*math.sin(a)
    for s in [-1,1]:d.line([(x-s*7*math.sin(a),y+s*7*math.cos(a)),(bx,by)])
def rel(d,pts,label,uml=False,child_many=True,parent_optional=False,labelpos=None):
    # Padre puede tener 0..N hijos: mitad próxima al padre discontinua.
    # Cada hijo referencia exactamente un padre salvo owner_id/winner_id opcionales.
    mid=len(pts)//2
    if len(pts)==2:
        x=(pts[0][0]+pts[1][0])/2;y=(pts[0][1]+pts[1][1])/2;pts=[pts[0],(x,y),pts[1]];mid=1
    if uml:
        d.line(pts)
        def near_endpoint(end,inside,at_start=False):
            x,y=end;dx,dy=inside[0]-x,inside[1]-y
            if abs(dx)>abs(dy):return (x+8 if dx>0 else x-35,y-10)
            return (x+8,y+24 if dy>0 else y-14)
        d.text(*near_endpoint(pts[0],pts[1]),'0..1' if parent_optional else '1',12)
        d.text(*near_endpoint(pts[-1],pts[-2]),'0..*' if child_many else '0..1',12)
    else:
        d.line(pts[:mid+1],dash=True);d.line(pts[mid:],dash=parent_optional)
        if child_many:crow(d,pts[-1],pts[-2])
    if labelpos:d.text(*labelpos,label,12)

def model_core(uml=False):
    d=D('uml-entidades-mesa' if uml else 'er-barker-mesa',1100,850)
    P={'rule_profile':(15,20,300),'game':(405,20,300),'player':(805,20,280),'round':(15,320,300),'participation':(405,320,300),'card_copy':(805,320,280),'card_position':(390,590,330)}
    rel(d,[(315,95),(360,95),(405,95)],'configura / usa',uml,labelpos=(321,65))
    rel(d,[(555,173),(555,245),(555,320)],'incluye / pertenece',uml,labelpos=(420,290))
    rel(d,[(945,110),(945,240),(650,240),(650,320)],'inscrito / corresponde',uml,labelpos=(790,225))
    rel(d,[(405,135),(355,135),(355,265),(165,265),(165,320)],'contiene / pertenece',uml,labelpos=(32,252))
    rel(d,[(705,100),(755,100),(755,280),(945,280),(945,320)],'dispone / pertenece',uml,labelpos=(820,269))
    rel(d,[(405,385),(360,385),(315,385)],'turno',uml,labelpos=(330,355))
    # Turno: origen real participation -> round. Se dibuja aparte en la fuente lógica.
    rel(d,[(165,473),(165,675),(390,675)],'ubica / pertenece',uml,labelpos=(180,661))
    rel(d,[(555,431),(555,510),(555,590)],'posee / en mano de',uml,parent_optional=True,labelpos=(566,520))
    rel(d,[(805,410),(760,410),(760,675),(720,675)],'ocupa / representa',uml,labelpos=(772,546))
    for n,(x,y,w) in P.items():entity(d,n,x,y,w,uml)
    if not uml:d.text(18,810,'Barker: # identificador; * obligatorio; o opcional. Mitad discontinua: participación opcional; pata de cuervo: muchos.',14)
    else:d.text(18,810,'Cada clase corresponde a una tabla homónima. Tipos SQL explícitos; asociaciones por PK/FK compuestas.',14)
    d.save()
def model_ledger(uml=False):
    d=D('uml-entidades-liquidacion' if uml else 'er-barker-liquidacion',1100,850)
    rel(d,[(150,110),(150,190),(150,275)],'resuelta por / de',uml,child_many=False,labelpos=(165,191))
    rel(d,[(640,89),(640,190),(930,190),(930,275)],'notifica / de',uml,labelpos=(810,178))
    rel(d,[(500,89),(500,185),(500,565)],'registra / de',uml,labelpos=(515,260))
    rel(d,[(190,470),(190,565)],'liquida / por',uml,labelpos=(205,530))
    rel(d,[(1000,110),(1000,145),(1095,145),(1095,530),(365,530),(365,620),(335,620)],'participante del movimiento',uml,labelpos=(775,506))
    rel(d,[(790,100),(730,100),(730,550),(650,550),(650,565)],'autor de / emitida por',uml,labelpos=(740,470))
    rel(d,[(790,70),(765,70),(765,215),(365,215),(365,305),(315,305)],'declarante',uml,labelpos=(370,292))
    rel(d,[(790,45),(745,45),(745,235),(345,235),(345,385),(315,385)],'ganador',uml,parent_optional=True,labelpos=(350,397))
    entity(d,'round',15,20,290,uml,True);entity(d,'game',410,20,270,uml,True);entity(d,'participation',790,20,295,uml,True)
    entity(d,'round_result',15,275,300,uml);entity(d,'outbox',790,275,295,uml)
    entity(d,'score_movement',15,565,320,uml);entity(d,'processed_operation',410,565,330,uml)
    d.rect(790,590,295,135,fill=FILL,rounded=True);d.text(807,615,'current_score',17,True)
    d.text(807,641,'Vista derivada, no tabla\ngame_id + player_id\nscore = SUM(delta)',14)
    d.text(18,807,'Las entidades superiores muestran solo su identificador; sus atributos completos están en la vista de mesa.',14)
    d.save()

def component(d,x,y,w,h,title,sub=''):
    d.rect(x,y,w,h,fill='#ffffff');d.text(x+w/2,y+23,'«component»',13,False,'center');d.text(x+w/2,y+48,title,18,True,'center')
    if sub:d.text(x+w/2,y+73,sub,14,False,'center')
    d.rect(x+w-28,y+10,16,14,fill='#ffffff');d.rect(x+w-32,y+12,7,4,fill='#ffffff');d.rect(x+w-32,y+19,7,4,fill='#ffffff')
def port(d,x,y):d.rect(x-5,y-5,10,10,fill='#ffffff')
def assembly_h(d,x1,x2,y,label,provider_right=True,label_offset=-25):
    mid=(x1+x2)/2
    port(d,x1,y);port(d,x2,y)
    if provider_right:
        d.line([(x1+5,y),(mid-15,y)]);d.arc(mid,y,15,90,270);d.circle(mid,y,8);d.line([(mid+8,y),(x2-5,y)])
    else:
        d.line([(x1+5,y),(mid-8,y)]);d.circle(mid,y,8);d.arc(mid,y,15,-90,90);d.line([(mid+15,y),(x2-5,y)])
    d.text(mid,y+label_offset,label,15,True,'center')
def assembly_v(d,x,y1,y2,label):
    mid=(y1+y2)/2;port(d,x,y1);port(d,x,y2)
    d.line([(x,y1+5),(x,mid-15)]);d.arc(x,mid,15,180,360);d.circle(x,mid,8);d.line([(x,mid+8),(x,y2-5)])
    d.text(x+20,mid+4,label,15,True)
def components():
    d=D('uml-componentes',1200,790)
    component(d,20,25,230,100,'Interfaz web','selección y navegación')
    component(d,420,25,290,100,'Adaptador WebSocket','sesión y comandos')
    component(d,900,25,270,100,'C1 Gestionar sala','perfil y participantes')
    component(d,20,310,230,110,'C5 Consultar estado','vista por destinatario')
    component(d,420,310,290,110,'C2 Conducir partida','CloseRound')
    component(d,900,310,270,110,'C3 + C4 Reglas','evaluación y liquidación')
    component(d,420,620,290,110,'C6 Persistencia','PostgresStore')
    component(d,900,620,270,110,'C7 Sincronización','outbox y despachador')
    assembly_h(d,250,420,80,'IGameGateway',True)
    assembly_h(d,710,900,115,'IConfigurarSala',True,40)
    port(d,420,110);d.line([(415,110),(315,110),(315,210),(135,210),(135,235)]);d.arc(135,250,15,180,360);d.circle(135,250);d.line([(135,258),(135,305)]);port(d,135,310);d.text(155,255,'IConsulta',14)
    assembly_v(d,565,125,310,'IComando')
    assembly_h(d,710,900,365,'Variant',True)
    assembly_v(d,565,420,620,'RoundStore')
    assembly_h(d,710,900,675,'EventStore',False)
    port(d,250,365);d.line([(255,365),(315,365),(315,675),(360,675)]);d.arc(375,675,15,90,270);d.circle(375,675);d.line([(383,675),(415,675)]);port(d,420,675);d.text(160,570,'ILeerPartida',14)
    port(d,1035,125);d.line([(1035,130),(1035,195)]);d.arc(1035,210,15,180,360);d.circle(1035,210);d.line([(1035,218),(1035,240),(1185,240),(1185,770),(565,770),(565,735)]);port(d,565,730);d.text(1048,207,'ISalaStore',14)
    d.text(870,759,'C1 requiere repositorio y catálogo de perfiles',13,False,'center')
    d.text(900,462,'Implementaciones independientes:',15,True);d.text(900,489,'classic@1 / apuntado@1\nRegistro por inyección en bootstrap',14)
    port(d,1035,620);d.line([(1035,615),(1035,550),(875,550),(875,80),(820,80)]);d.arc(805,80,15,-90,90);d.circle(805,80);d.line([(797,80),(715,80)]);port(d,710,80);d.text(735,190,'IPublicador\nautorizado',14)
    d.text(20,485,'Puerto: cuadrado. Provista: círculo.',14)
    d.text(20,510,'Requerida: semicírculo.',14)
    d.text(20,758,'Diagrama de diseño completo; el alcance ejecutable está identificado en el informe.',14)
    d.save()

RISKS=[
{'id':'R1','risk':'Doble liquidación por reintento o cierres simultáneos','p':3,'i':3,'why':'Hay varios clientes y los reintentos son esperables; repetir un descuento altera el ganador.','mitigation':'Bloqueo por partida, versión esperada, PK del acta y clave de operación con fingerprint.','check':'Pruebas de aplicación y PostgreSQL entre conexiones.','rp':1,'ri':3},
{'id':'R2','risk':'Exposición de manos privadas','p':2,'i':3,'why':'Una difusión común puede incluir datos de otro jugador; compromete la equidad de toda la ronda.','mitigation':'Proyección por destinatario, autorización de sala y outbox sin cartas.','check':'Prueba de vista privada; integrar prueba de dos sesiones WebSocket.','rp':1,'ri':3},
{'id':'R3','risk':'Estado confirmado sin notificación recuperable','p':2,'i':3,'why':'El commit y el envío por red son acciones distintas; una caída intermedia desincroniza clientes.','mitigation':'Outbox transaccional, eventId estable, reintento y snapshot versionado al reconectar.','check':'Fallo de outbox revierte; fallo de publicador conserva evento.','rp':1,'ri':3},
{'id':'R4','risk':'Reglas de una modalidad aplicadas a la otra','p':2,'i':3,'why':'Se comparten cartas y turno, pero el fin de partida y los puntos son distintos.','mitigation':'Variant inyectada por clave y versión; perfiles inmutables; pruebas por modalidad.','check':'Clásica vuelve a inicio; Apuntado liquida y continúa.','rp':1,'ri':3},
{'id':'R5','risk':'Acoplamiento y ciclos entre módulos','p':3,'i':2,'why':'Un único proceso permite imports fáciles; la duplicación del motor encarece los cambios.','mitigation':'Contratos comunes, matriz de imports, raíz de composición y TSArch en cada cambio.','check':'FF-01 a FF-05 y controles negativos.','rp':1,'ri':2},
{'id':'R6','risk':'Validadores demasiado complejos','p':3,'i':2,'why':'As, duplicados, patrones y toque introducen muchas ramas y casos límite.','mitigation':'Funciones puras pequeñas, particionador compartido y puerta CC máxima 10.','check':'FF-06, FF-08 y reporte real de complejidad.','rp':1,'ri':2},
{'id':'R7','risk':'Comando de otro jugador o de versión obsoleta','p':2,'i':3,'why':'El cliente no es confiable y puede reenviar una acción después de perder su turno.','mitigation':'Identidad desde sesión; membresía, turno, fase y versión dentro de la unidad de trabajo.','check':'Rechazo de intruso, turno incorrecto y versión antigua.','rp':1,'ri':3},
{'id':'R8','risk':'Evaluación lenta bajo carga','p':2,'i':2,'why':'Se exploran organizaciones de diez cartas; varias salas comparten CPU.','mitigation':'Dominio puro, tamaño acotado, medición p95 y revisión de CPU antes de escalar.','check':'Ensayo de carga multijugador pendiente; meta de E1.','rp':2,'ri':2},
{'id':'R9','risk':'Puntos ciegos por revisión individual','p':3,'i':2,'why':'No existe contraste con perspectivas de otros miembros; pueden omitirse escenarios.','mitigation':'Recorrer cada frontera de confianza, operación y variante; repetir revisión con resultados de pruebas.','check':'Registro individual trazable y lista de supuestos pendientes.','rp':2,'ri':2}]
(ROOT/'docs/risk-storming').mkdir(exist_ok=True)
(ROOT/'docs/risk-storming/risks.json').write_text(json.dumps(RISKS,ensure_ascii=False,indent=2),encoding='utf-8')
def matrix():
    d=D('matriz-riesgo',1000,540);colors={1:'#e7f0e9',2:'#e7f0e9',3:'#fff0c7',4:'#fff0c7',6:'#f6d9d5',9:'#f6d9d5'}
    for row,p in enumerate([3,2,1]):
        d.text(60,100+row*130,f'P = {p}',18,True)
        for col,i in enumerate([1,2,3]):
            x=170+col*260;y=35+row*130;score=p*i;ids=', '.join(r['id'] for r in RISKS if r['p']==p and r['i']==i)
            d.rect(x,y,250,120,colors[score]);d.text(x+125,y+32,f'I × P = {score}',17,True,'center');d.text(x+125,y+70,ids or 'Sin riesgos asignados',16,False,'center')
    for col,i in enumerate([1,2,3]):d.text(295+col*260,455,f'Impacto {i}',18,True,'center')
    d.text(170,500,'Bajo 1–2    |    Medio 3–4    |    Alto 6–9. Valoración cualitativa individual.',16);d.save()
if __name__=='__main__':
    components();model_core();model_ledger();model_core(True);model_ledger(True);matrix();print('6 modelos: SVG + drawio + PDF vectorial + PNG')
