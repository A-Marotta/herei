function GetMap()
{
    var map = new Microsoft.Maps.Map('#bingMap');

    //Add your post map load code here.
    var center = map.getCenter();

    var pin = new Microsoft.Maps.Pushpin(center, {
        title: 'Microsoft',
        subTitle: 'City Center',
        text: '1'
    });
    
    var loc2 = new Microsoft.Maps.Location(-37.80220538474754, 145.00096911859362);
    var pin2 = new Microsoft.Maps.Pushpin(loc2, {
        title: 'GA Melbourne',
        subTitle: 'Melbourne campus',
        text: '2'
    });

    var loc3 = new Microsoft.Maps.Location(-37.83246010626527,144.93334995186427);
    var pin3 = new Microsoft.Maps.Pushpin(loc3, {
        title: 'RMIT',
        subTitle: 'CBD campus',
        text: '3'
    });

    var loc4 = new Microsoft.Maps.Location(-37.81705225725522,144.95636947184306);
    var pin4 = new Microsoft.Maps.Pushpin(loc4, {
        title: 'Testing idk',
        subTitle: 'Ci23ty Center',
        text: '4'
    });

    map.entities.push(pin);
    map.entities.push(pin2);
    map.entities.push(pin3);
    map.entities.push(pin4);
}