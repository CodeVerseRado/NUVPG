const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'status',
  description: 'Displays the current music status and voice channel info.',
  category: 'music',

  run: async (client, message, args) => {
    const player = client.manager.players.get(message.guild.id);

    if (!player || !player.queue.current) {
      return message.reply('❌ No music is currently playing in this server.');
    }

    const voiceChannel = message.guild.members.me.voice.channel;
    if (!voiceChannel) {
      return message.reply('❌ I am not connected to any voice channel.');
    }

    const listeners = voiceChannel.members.filter(member => !member.user.bot).size;
    const currentTrack = player.queue.current;

    const embed = new EmbedBuilder()
      .setTitle('🎶 Music Status')
      .setColor('Random')
      .addFields(
        { name: 'Now Playing', value: `[${currentTrack.title}](${currentTrack.uri})` },
        { name: 'Voice Channel', value: voiceChannel.name, inline: true },
        { name: 'Listeners', value: `${listeners}`, inline: true },
        { name: 'Volume', value: `${player.volume}%`, inline: true }
      )
      .setThumbnail(currentTrack.displayThumbnail('hq'))
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

    message.channel.send({ embeds: [embed] });
  }
};
