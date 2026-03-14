import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Notification } from '../../interfaces/notification';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../interfaces/auth';
import { AuthIduserService } from '../../services/auth-iduser.service';
import { ConfirmationService } from 'primeng/api';
import { SignalRService } from '../../services/signalr.service';
import { SharedService2 } from '../../services/navbar-notification-shared.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent {
  @Input() notifications: Notification[] = [];
  notificationsOpen: boolean = false;
  userId: string;
  markAsRead: { [key: string]: boolean } = {};
  hasUnMarked: boolean = false;
  constructor(
    private notificationService: NotificationService,
    private authService: AuthIduserService,
    private confirmationService: ConfirmationService,
    private signalRService: SignalRService,
    private sharedService: SharedService2,
  ) {}

  ngOnInit() {
    const id = this.authService.getUserId();
    if (id) {
      this.userId = id;
      this.getTasks();
    }
    this.sharedService.newNotification$.subscribe((data) => {
      this.getNotifications(data);
    });
  }

  getTasks(){
    console.log("usao samm");
    this.notificationService
        .getNotifications(this.userId)
        .subscribe((data) => {
          data.map((d) => {
            this.markAsRead[d.id] = false;
          });
          this.notifications = data;
          this.checkUnMarkedNotifications(data);
        });
  }
  getNotifications(notification:any){
    const newNotifications = [...this.notifications,notification];
    this.notifications=newNotifications
    console.log(newNotifications);
    this.checkUnMarkedNotifications(newNotifications);
  }

  checkUnMarkedNotifications(notifications: Notification[]) {
    this.hasUnMarked = notifications.some((notification) => notification.isRead === 0);
  }
  toggleMarkRead(id: Number) {
    const newObj = { ...this.markAsRead };
    const strId = id.toString();
    newObj[strId] = !newObj[strId];
    this.markAsRead = newObj;
  }
 
  markNotificationAsRead(event: Event, id: Number) {
    event.preventDefault();
    this.notificationService.markNotificationRead(id).subscribe((data) => {
      const newNotifications: Notification[] = this.notifications.map(
        (notification) => {
          if (notification.id === id && !notification.isRead) {
            return { ...notification, isRead: 1 };
          }
          return notification;
        }
      );
      console.log(newNotifications);
      this.notifications = newNotifications;
      const value = newNotifications.some((notification) => {
        console.log(notification.isRead);
        if (notification.isRead == 0) {
          return true;
        }
        return false;
      });
      this.hasUnMarked = value;
    });
  }

  markAllNotificationsAsRead() {
    this.notifications.map(notification=>{
      if(!notification.isRead){
        this.notificationService.markNotificationRead(notification.id).subscribe((data) => {
          const newNotifications: Notification[] = this.notifications.map(
            (newNotification) => {
              if (notification.id === newNotification.id && !newNotification.isRead) {
                return { ...newNotification, isRead: 1 };
              }
              return newNotification;
            }
          );
            this.notifications = newNotifications;
            const value = newNotifications.some((newNotification) => {
              if (newNotification.isRead == 0) {
                return true;
              }
              return false;
            });
            this.hasUnMarked = value;
          });
       }
    })
    
  }

  openNotifications() {
    this.notificationsOpen = !this.notificationsOpen;
  }
  deleteNotification(event: Event, id: Number) {
    
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this notification?',
      accept: () => {
        this.notificationService.deleteNotification(id).subscribe({
          next: (data) => {
            let newNotifications = this.notifications.filter(
              (n) => n.id !== data.id
            );
            const value = newNotifications.some((notification) => {
              console.log(notification.isRead);
              if (notification.isRead == 0) {
                return true;
              }
              return false;
            });
            this.hasUnMarked = value;
            this.notifications = newNotifications;
          },
          error: (error) => {
            console.error('Error deleting notification:', error);
          },
        });
      },
    });
  }
}
